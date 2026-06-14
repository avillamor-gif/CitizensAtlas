'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProjectBrief } from '@/types/types'
import { TiptapEditor } from '@/components/ui/tiptap-editor'

interface ProjectBriefFormData {
  project_name: string
  project_type?: string
  location: string
  country?: string
  financing_amount?: string
  financiers?: string
  financial_instruments?: string
  other_partners_involved?: string
  timeline_and_status?: string
  safeguard_categories?: string
  negative_impacts?: string
  reprisals?: string
  advocacy_timeline?: string
  other_information?: string
}

interface ProjectBriefFormProps {
  onCancel: () => void
  onSave: (data: ProjectBriefFormData) => void
  briefToEdit?: ProjectBrief | ProjectBriefFormData | null
  userRole?: 'contributor' | 'admin' | 'super-admin'
  userId?: string
  countries?: string[]
}

const FormField: React.FC<{ 
  label: string
  children: React.ReactNode
  required?: boolean 
}> = ({ label, children, required }) => (
  <div className="mb-6">
    <Label className="text-sm font-semibold text-brand-dark-blue mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
  </div>
)

const ProjectBriefForm: React.FC<ProjectBriefFormProps> = ({
  onCancel,
  onSave,
  briefToEdit,
  userRole,
  userId,
  countries = []
}) => {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<ProjectBriefFormData>(
    briefToEdit || {
      project_name: '',
      project_type: '',
      location: '',
      country: '',
      financing_amount: '',
      financiers: '',
      financial_instruments: '',
      other_partners_involved: '',
      timeline_and_status: '',
      safeguard_categories: '',
      negative_impacts: '',
      reprisals: '',
      advocacy_timeline: '',
      other_information: '',
    }
  )

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleQuillChange = (field: keyof ProjectBriefFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Add status based on user role
    const briefData = {
      ...formData,
      status: (userRole === 'admin' || userRole === 'super-admin') ? 'published' : 'draft',
      submitted_by: userId,
      submitted_at: new Date().toISOString()
    } as any
    
    console.log('📋 Form Submit - Field names:', Object.keys(briefData))
    console.log('📋 Form Submit - Full data:', JSON.stringify(briefData, null, 2))
    onSave(briefData)
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brand-dark-blue">
            {briefToEdit ? 'Edit Project Brief' : 'Add Project Brief'}
          </h2>
          <p className="text-gray-600 mt-1">
            {briefToEdit ? 'Update project brief details.' : 'Submit a new project brief to the database.'}
          </p>
        </div>
        <div className="w-full md:w-80">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country: <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.country}
            onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {countries.length > 0 ? (
                Array.from(new Set(countries)).sort().map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  No countries available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Project Name */}
              <FormField label="Project Name" required>
                <Input
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  required
                />
              </FormField>

              {/* Project Type */}
              <FormField label="Project Type (kind of energy project)">
                <Input
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleInputChange}
                  placeholder="e.g., Waste-to-Energy, Chemical Recycling"
                />
              </FormField>

              {/* Location */}
              <FormField label="Location" required>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Region, Country, City"
                  required
                />
              </FormField>

              {/* Financing Amount */}
              <FormField label="Financing Amount">
                <Input
                  name="financing_amount"
                  value={formData.financing_amount}
                  onChange={handleInputChange}
                  placeholder="e.g., $50,000,000"
                />
              </FormField>

              {/* Financiers */}
              <FormField label="Financiers">
                <Input
                  name="financiers"
                  value={formData.financiers}
                  onChange={handleInputChange}
                  placeholder="e.g., World Bank, ADB"
                />
              </FormField>

              {/* Financial Instruments */}
              <FormField label="Financial Instruments">
                <Input
                  name="financial_instruments"
                  value={formData.financial_instruments}
                  onChange={handleInputChange}
                  placeholder="e.g., Loan, Grant"
                />
              </FormField>

              {/* Other partners involved */}
              <FormField label="Other partners involved">
                <Textarea
                  name="other_partners_involved"
                  value={formData.other_partners_involved}
                  onChange={handleInputChange}
                  placeholder="List other partners or stakeholders"
                  rows={3}
                />
              </FormField>

              {/* Timeline and Status */}
              <FormField label="Timeline and Status">
                <Textarea
                  name="timeline_and_status"
                  value={formData.timeline_and_status}
                  onChange={handleInputChange}
                  placeholder="e.g., Approval: 2023-05-15 | Start: 2024-01-01 | Status: Active"
                  rows={3}
                />
              </FormField>

              {/* Safeguard categories */}
              <FormField label="Safeguard categories">
                <Input
                  name="safeguard_categories"
                  value={formData.safeguard_categories}
                  onChange={handleInputChange}
                  placeholder="Environmental and Social safeguard categories"
                />
              </FormField>

              {/* Negative impacts of the project */}
              <FormField label="Negative impacts of the project">
                <div className="mb-24">
                  <TiptapEditor
                    value={formData.negative_impacts}
                    onChange={(value) => handleQuillChange('negative_impacts', value)}
                    height="200px"
                  />
                </div>
              </FormField>

              {/* Reprisals associated with the project */}
              <FormField label="Reprisals associated with the project (including articles in the press)">
                <div className="mb-24">
                  <TiptapEditor
                    value={formData.reprisals}
                    onChange={(value) => handleQuillChange('reprisals', value)}
                    height="200px"
                  />
                </div>
              </FormField>

              {/* Short timeline of advocacy activities */}
              <FormField label="Short timeline of advocacy activities and response of the bank (CSO lobbying, community actions such as petitions to the local govt, bank, etc)">
                <div className="mb-24">
                  <TiptapEditor
                    value={formData.advocacy_timeline}
                    onChange={(value) => handleQuillChange('advocacy_timeline', value)}
                    height="200px"
                  />
                </div>
              </FormField>

              {/* Any other information */}
              <FormField label="Any other information and links to project documents">
                <div className="mb-24">
                  <TiptapEditor
                    value={formData.other_information}
                    onChange={(value) => handleQuillChange('other_information', value)}
                    height="200px"
                  />
                </div>
              </FormField>
            </div>
          </CardContent>

          {/* Footer buttons */}
          <div className="p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-brand-dark-blue hover:bg-brand-medium-blue"
            >
              {briefToEdit ? 'Update Brief' : 'Save Brief'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ProjectBriefForm
