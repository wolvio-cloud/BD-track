'use client'

import { useState, useEffect, FormEvent } from 'react'
import { addLead, updateLead } from '@/lib/api'
import { STAGES } from '@/lib/utils'
import type { Lead, User } from '@/lib/types'

const PRODUCTS = ['CEI (Contract Execution Intelligence)', 'QA Testing', 'AI Automation', 'Veeva / Life Sciences', 'AI Services']
const TIMELINES = ['Immediate', '3–6 months', '6–12 months']
const QUALITIES = ['High', 'Medium', 'Low']
const OWNERS = ['Madhan', 'Mani', 'Shifana']

interface LeadModalProps {
  mode: 'add' | 'edit'
  lead?: Lead
  currentUser: User
  onClose: () => void
  onSaved: (message: string) => void
}

type FormData = Omit<Lead, 'rowIndex' | 'leadId' | 'createdAt' | 'updatedAt' | 'enteredBy'>

function emptyForm(currentUser: User): FormData {
  return {
    company: '',
    contact: '',
    designation: '',
    email: '',
    phone: '',
    linkedin: '',
    industry: '',
    empSize: '',
    location: '',
    operating: '',
    product: '',
    source: '',
    challenges: '',
    timeline: '',
    budget: '',
    dm: '',
    procurement: '',
    stage: 'Prospect',
    quality: '',
    value: '',
    discoveryDate: '',
    lastContact: '',
    nextAction: '',
    owner: currentUser.name,
    comments: '',
  }
}

function formFromLead(lead: Lead): FormData {
  return {
    company: lead.company,
    contact: lead.contact,
    designation: lead.designation,
    email: lead.email,
    phone: lead.phone,
    linkedin: lead.linkedin,
    industry: lead.industry,
    empSize: lead.empSize,
    location: lead.location,
    operating: lead.operating,
    product: lead.product,
    source: lead.source,
    challenges: lead.challenges,
    timeline: lead.timeline,
    budget: lead.budget,
    dm: lead.dm,
    procurement: lead.procurement,
    stage: lead.stage,
    quality: lead.quality,
    value: lead.value,
    discoveryDate: lead.discoveryDate,
    lastContact: lead.lastContact,
    nextAction: lead.nextAction,
    owner: lead.owner,
    comments: lead.comments,
  }
}

interface FieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
}
function Field({ label, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-mono text-text2 uppercase tracking-wider">
        {label}{required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full bg-surface border border-border text-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-accent2 transition-colors font-body placeholder-text3'
const selectCls = `${inputCls} cursor-pointer`

export default function LeadModal({ mode, lead, currentUser, onClose, onSaved }: LeadModalProps) {
  const [form, setForm] = useState<FormData>(
    mode === 'edit' && lead ? formFromLead(lead) : emptyForm(currentUser)
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isReadOnly = mode === 'edit' && currentUser.role === 'BD' && lead?.owner !== currentUser.name

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function set(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.company.trim()) { setError('Company is required.'); return }
    if (!form.contact.trim()) { setError('Contact name is required.'); return }
    if (!form.stage) { setError('Stage is required.'); return }

    setSaving(true)
    setError('')
    try {
      if (mode === 'add') {
        await addLead({ ...form, enteredBy: currentUser.name })
        onSaved('Lead added successfully')
      } else if (lead) {
        await updateLead({ ...form, rowIndex: lead.rowIndex, enteredBy: lead.enteredBy })
        onSaved('Lead updated successfully')
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lead')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm flex items-center justify-end"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="h-full w-full max-w-2xl bg-surface border-l border-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-display font-bold text-lg text-text">
              {mode === 'add' ? 'Add Lead' : 'Edit Lead'}
            </h2>
            {mode === 'edit' && lead && (
              <p className="text-xs font-mono text-text3 mt-0.5">{lead.leadId} · {lead.company}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text3 hover:text-text transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company */}
            <Field label="Company" required>
              <input className={inputCls} value={form.company} onChange={(e) => set('company', e.target.value)} disabled={isReadOnly} placeholder="Acme Corp" />
            </Field>

            {/* Contact */}
            <Field label="Contact Name" required>
              <input className={inputCls} value={form.contact} onChange={(e) => set('contact', e.target.value)} disabled={isReadOnly} placeholder="Jane Smith" />
            </Field>

            {/* Designation */}
            <Field label="Designation">
              <input className={inputCls} value={form.designation} onChange={(e) => set('designation', e.target.value)} disabled={isReadOnly} placeholder="VP Engineering" />
            </Field>

            {/* Email */}
            <Field label="Email">
              <input className={inputCls} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} disabled={isReadOnly} placeholder="jane@acme.com" />
            </Field>

            {/* Phone */}
            <Field label="Phone">
              <input className={inputCls} value={form.phone} onChange={(e) => set('phone', e.target.value)} disabled={isReadOnly} placeholder="+91 98765 43210" />
            </Field>

            {/* LinkedIn */}
            <Field label="LinkedIn">
              <input className={inputCls} value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} disabled={isReadOnly} placeholder="linkedin.com/in/janesmith" />
            </Field>

            {/* Industry */}
            <Field label="Industry">
              <input className={inputCls} value={form.industry} onChange={(e) => set('industry', e.target.value)} disabled={isReadOnly} placeholder="Life Sciences" />
            </Field>

            {/* Emp Size */}
            <Field label="Employee Size">
              <input className={inputCls} value={form.empSize} onChange={(e) => set('empSize', e.target.value)} disabled={isReadOnly} placeholder="500–1000" />
            </Field>

            {/* HQ Location */}
            <Field label="HQ Location">
              <input className={inputCls} value={form.location} onChange={(e) => set('location', e.target.value)} disabled={isReadOnly} placeholder="Hyderabad, India" />
            </Field>

            {/* Operating Locations */}
            <Field label="Operating Locations">
              <input className={inputCls} value={form.operating} onChange={(e) => set('operating', e.target.value)} disabled={isReadOnly} placeholder="Pan India, UAE" />
            </Field>

            {/* Product */}
            <Field label="Product / Service">
              <select className={selectCls} value={form.product} onChange={(e) => set('product', e.target.value)} disabled={isReadOnly}>
                <option value="">Select…</option>
                {PRODUCTS.map((p) => <option key={p} value={p} className="bg-surface">{p}</option>)}
              </select>
            </Field>

            {/* Source */}
            <Field label="Lead Source">
              <input className={inputCls} value={form.source} onChange={(e) => set('source', e.target.value)} disabled={isReadOnly} placeholder="LinkedIn / Referral" />
            </Field>

            {/* Stage */}
            <Field label="Sales Stage" required>
              <select className={selectCls} value={form.stage} onChange={(e) => set('stage', e.target.value)} disabled={isReadOnly}>
                {STAGES.map((s) => <option key={s} value={s} className="bg-surface">{s}</option>)}
              </select>
            </Field>

            {/* Quality */}
            <Field label="Lead Quality">
              <select className={selectCls} value={form.quality} onChange={(e) => set('quality', e.target.value)} disabled={isReadOnly}>
                <option value="">Select…</option>
                {QUALITIES.map((q) => <option key={q} value={q} className="bg-surface">{q}</option>)}
              </select>
            </Field>

            {/* Value */}
            <Field label="Expected Deal Value (₹)">
              <input className={inputCls} type="number" min="0" value={form.value} onChange={(e) => set('value', e.target.value)} disabled={isReadOnly} placeholder="500000" />
            </Field>

            {/* Timeline */}
            <Field label="Timeline">
              <select className={selectCls} value={form.timeline} onChange={(e) => set('timeline', e.target.value)} disabled={isReadOnly}>
                <option value="">Select…</option>
                {TIMELINES.map((t) => <option key={t} value={t} className="bg-surface">{t}</option>)}
              </select>
            </Field>

            {/* Budget */}
            <Field label="Budget Confirmed">
              <select className={selectCls} value={form.budget} onChange={(e) => set('budget', e.target.value)} disabled={isReadOnly}>
                <option value="">Select…</option>
                <option value="Yes" className="bg-surface">Yes</option>
                <option value="No" className="bg-surface">No</option>
              </select>
            </Field>

            {/* Decision Maker */}
            <Field label="Decision Maker Identified">
              <select className={selectCls} value={form.dm} onChange={(e) => set('dm', e.target.value)} disabled={isReadOnly}>
                <option value="">Select…</option>
                <option value="Yes" className="bg-surface">Yes</option>
                <option value="No" className="bg-surface">No</option>
              </select>
            </Field>

            {/* Procurement */}
            <Field label="Procurement Process">
              <select className={selectCls} value={form.procurement} onChange={(e) => set('procurement', e.target.value)} disabled={isReadOnly}>
                <option value="">Select…</option>
                <option value="Yes" className="bg-surface">Yes</option>
                <option value="No" className="bg-surface">No</option>
                <option value="Later" className="bg-surface">Later</option>
              </select>
            </Field>

            {/* Discovery Date */}
            <Field label="Discovery Date">
              <input className={inputCls} type="date" value={form.discoveryDate} onChange={(e) => set('discoveryDate', e.target.value)} disabled={isReadOnly} />
            </Field>

            {/* Last Contact */}
            <Field label="Last Contact Date">
              <input className={inputCls} type="date" value={form.lastContact} onChange={(e) => set('lastContact', e.target.value)} disabled={isReadOnly} />
            </Field>

            {/* Next Action */}
            <Field label="Next Action Date">
              <input className={inputCls} type="date" value={form.nextAction} onChange={(e) => set('nextAction', e.target.value)} disabled={isReadOnly} />
            </Field>

            {/* Owner */}
            <Field label="Owner">
              <select className={selectCls} value={form.owner} onChange={(e) => set('owner', e.target.value)} disabled={isReadOnly || currentUser.role === 'BD'}>
                {OWNERS.map((o) => <option key={o} value={o} className="bg-surface">{o}</option>)}
              </select>
            </Field>
          </div>

          {/* Challenges - full width */}
          <div className="mt-4">
            <Field label="Current Challenges">
              <textarea
                className={`${inputCls} resize-none h-20`}
                value={form.challenges}
                onChange={(e) => set('challenges', e.target.value)}
                disabled={isReadOnly}
                placeholder="Pain points and business problems…"
              />
            </Field>
          </div>

          {/* Comments - full width */}
          <div className="mt-4">
            <Field label="Comments / Notes">
              <textarea
                className={`${inputCls} resize-none h-20`}
                value={form.comments}
                onChange={(e) => set('comments', e.target.value)}
                disabled={isReadOnly}
                placeholder="Internal notes…"
              />
            </Field>
          </div>

          {error && (
            <p className="text-danger text-sm font-body mt-4">{error}</p>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 shrink-0 bg-surface">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-body text-text2 hover:text-text transition-colors px-4 py-2 rounded-lg border border-border hover:border-border2"
          >
            Cancel
          </button>
          {!isReadOnly && (
            <button
              type="submit"
              form=""
              disabled={saving}
              onClick={handleSubmit as unknown as React.MouseEventHandler<HTMLButtonElement>}
              className="text-sm font-display font-bold bg-accent text-bg px-5 py-2 rounded-lg hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : mode === 'add' ? 'Add Lead' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
