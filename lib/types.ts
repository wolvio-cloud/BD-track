export interface Lead {
  rowIndex: number
  leadId: string
  company: string
  contact: string
  designation: string
  email: string
  phone: string
  linkedin: string
  industry: string
  empSize: string
  location: string
  operating: string
  product: string
  source: string
  challenges: string
  timeline: string
  budget: string
  dm: string
  procurement: string
  stage: string
  quality: string
  value: string
  discoveryDate: string
  lastContact: string
  nextAction: string
  owner: string
  enteredBy: string
  comments: string
  createdAt: string
  updatedAt: string
}

export interface User {
  name: string
  role: 'Founder' | 'BD'
}
