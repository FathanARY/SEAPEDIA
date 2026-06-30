import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, roles } = body;

    // Validasi input
    if (!username || !email || !password || !roles || roles.length === 0) {
      return NextResponse.json(
        { error: 'Semua field harus diisi dan minimal satu peran harus dipilih' },
        { status: 400 }
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Validasi panjang password
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Validasi roles yang diperbolehkan
    const allowedRoles = ['BUYER', 'SELLER', 'DRIVER'];
    const invalidRoles = roles.filter((r: string) => !allowedRoles.includes(r));
    if (invalidRoles.length > 0) {
      return NextResponse.json(
        { error: `Peran tidak valid: ${invalidRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Cek username sudah ada
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: 'Username sudah digunakan' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Email sudah digunakan' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat user dan roles
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roles: {
          create: roles.map((role: string) => ({ role })),
        },
      },
      include: { roles: true },
    });

    const userRoles = user.roles.map((r) => r.role);
    const activeRole = userRoles.length === 1 ? userRoles[0] : null;

    // Buat token
    const token = await createToken({
      userId: user.id,
      username: user.username,
      roles: userRoles,
      activeRole,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: userRoles,
        activeRole,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}
