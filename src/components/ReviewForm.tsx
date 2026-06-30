'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import StarRating from '@/components/ui/StarRating';

interface ReviewFormProps {
  onSubmit: (review: { name: string; rating: number; comment: string }) => Promise<void>;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError('Nama harus diisi');
      return;
    }
    if (rating === 0) {
      setError('Pilih rating terlebih dahulu');
      return;
    }
    if (!comment.trim()) {
      setError('Komentar harus diisi');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), rating, comment: comment.trim() });
      setName('');
      setRating(0);
      setComment('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Gagal mengirim ulasan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nama"
        placeholder="Masukkan nama Anda"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={100}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">Rating</label>
        <StarRating rating={rating} onRate={setRating} size="lg" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-comment" className="text-sm font-medium text-neutral-700">
          Komentar
        </label>
        <textarea
          id="review-comment"
          rows={4}
          placeholder="Bagikan pengalaman Anda menggunakan SEAPEDIA..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          className="w-full px-4 py-2.5 text-sm rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-all duration-200 resize-none"
        />
        <span className="text-xs text-neutral-400 text-right">{comment.length}/1000</span>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg">
          Ulasan berhasil dikirim! Terima kasih atas masukan Anda.
        </p>
      )}

      <Button type="submit" loading={loading} fullWidth>
        Kirim Ulasan
      </Button>
    </form>
  );
}
