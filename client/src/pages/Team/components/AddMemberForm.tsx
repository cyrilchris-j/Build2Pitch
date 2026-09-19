import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { TeamMember } from '@/types';

export type MemberFormValues = Omit<TeamMember, 'id' | 'role' | 'joinedAt' | 'userId' | 'isRegisteredUser'> & { password?: string };

interface AddMemberFormProps {
  initial?: TeamMember;
  onSubmit: (values: MemberFormValues) => Promise<void>;
  onCancel: () => void;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({ initial, onSubmit, onCancel }) => {
  const [values, setValues] = useState<Record<string, string>>({
    name: initial?.name || '', registerNumber: initial?.registerNumber || '', email: initial?.email || '',
    mobile: initial?.mobile || '', gender: initial?.gender || '', section: initial?.section || '', password: '',
  });
  const [saving, setSaving] = useState(false);
  const update = (key: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setValues((current) => ({ ...current, [key]: event.target.value }));
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); try { await onSubmit(values as MemberFormValues); } finally { setSaving(false); } };
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Input label="Name" value={values.name} onChange={update('name')} required />
      <Input label="Register number" value={values.registerNumber} onChange={update('registerNumber')} required />
      <Input label="Email" type="email" value={values.email} onChange={update('email')} required />
      <Input label="Mobile" type="tel" value={values.mobile} onChange={update('mobile')} required />
      <label className="space-y-1.5 text-xs text-foreground-muted">Gender<select className="mt-1 w-full rounded-lg border border-border bg-card px-3.5 py-2 text-sm text-foreground" value={values.gender} onChange={update('gender')} required><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option></select></label>
      <Input label="Section" value={values.section} onChange={update('section')} required />
      <Input label={initial ? 'New password (optional)' : 'Password'} type="password" value={values.password} onChange={update('password')} required={!initial} />
      <div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button><Button type="submit" isLoading={saving}>{initial ? 'Save changes' : 'Add member'}</Button></div>
    </form>
  );
};
