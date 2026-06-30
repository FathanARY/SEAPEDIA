import { NextRequest, NextResponse } from 'next/server';
import { getSession, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { error: 'Peran harus dipilih' },
        { status: 400 }
      );
    }

    // Cek apakah user memiliki role tersebut
    if (!session.roles.includes(role)) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki peran tersebut' },
        { status: 403 }
      );
    }

    // Buat token baru dengan active role
    const token = await createToken({
      userId: session.userId,
      username: session.username,
      roles: session.roles,
      activeRole: role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      message: `Peran aktif diubah ke ${role}`,
      activeRole: role,
    });
  } catch (error) {
    console.error('Select role error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memilih peran' },
      { status: 500 }
    );
  }
}
