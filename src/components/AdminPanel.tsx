import { useState, useEffect, useCallback } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Plus, Edit, Trash2, Save, X, Settings, User, Briefcase, Award } from 'lucide-react'
import { useToast } from '../hooks/use-toast'
import { useLanguage } from '../contexts/LanguageContext'

interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  category: string
  technologies: string[]
  imageUrl?: string
  demoUrl?: string
  githubUrl?: string
  featured: boolean
}

interface Skill {
  id: string
  name: string
  level: number
  category: string
  icon?: string
}

interface ProfileInfo {
  id: string
  name?: string
  title?: string
  description?: string
  resumeUrl?: string
  githubUrl?: string
  linkedinUrl?: string
  email?: string
}

interface Certification {
  id: string
  title: string
  issuer: string
  year: string
  icon?: string
}

export function AdminPanel() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [profile, setProfile] = useState<ProfileInfo | null>(null)
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // Estados para formularios
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [showCertForm, setShowCertForm] = useState(false)

  const loadData = useCallback(async () => {
    try {
      // Cargar datos desde localStorage o usar datos de ejemplo
      const savedProjects = localStorage.getItem('portfolio_projects')
      const savedSkills = localStorage.getItem('portfolio_skills')
      const savedProfile = localStorage.getItem('portfolio_profile')
      const savedCertifications = localStorage.getItem('portfolio_certifications')

      const exampleProjects: Project[] = [
        {
          id: 'proj_1',
          title: 'AI Chatbot Assistant',
          description: 'Chatbot inteligente con procesamiento de lenguaje natural',
          longDescription: 'Un asistente virtual avanzado que utiliza modelos de lenguaje para proporcionar respuestas contextuales y realizar tareas complejas.',
          category: 'AI',
          technologies: ['Python', 'OpenAI', 'FastAPI', 'React'],
          imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
          demoUrl: 'https://demo.example.com',
          githubUrl: 'https://github.com/example/chatbot',
          featured: true
        },
        {
          id: 'proj_2',
          title: 'Predictive Analytics Dashboard',
          description: 'Dashboard para análisis predictivo de datos empresariales',
          longDescription: 'Plataforma completa de análisis predictivo que permite a las empresas tomar decisiones basadas en datos.',
          category: 'Data Science',
          technologies: ['Python', 'Pandas', 'Scikit-learn', 'Plotly'],
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
          featured: false
        }
      ]

      const exampleSkills: Skill[] = [
        { id: 'skill_1', name: 'Python', level: 95, category: 'Programming', icon: '🐍' },
        { id: 'skill_2', name: 'Machine Learning', level: 90, category: 'ML/AI', icon: '🤖' },
        { id: 'skill_3', name: 'TensorFlow', level: 85, category: 'ML/AI', icon: '🧠' },
        { id: 'skill_4', name: 'React', level: 80, category: 'Programming', icon: '⚛️' }
      ]

      const exampleProfile: ProfileInfo = {
        id: 'profile_1',
        name: 'Tu Nombre',
        title: 'AI & Data Science Visionary',
        description: 'Especialista en inteligencia artificial y ciencia de datos con pasión por crear soluciones innovadoras.',
        email: 'tu@email.com',
        githubUrl: 'https://github.com/tuusuario',
        linkedinUrl: 'https://linkedin.com/in/tuusuario',
        resumeUrl: 'https://example.com/cv.pdf'
      }

      const exampleCertifications: Certification[] = [
        { id: 'cert_1', title: 'AWS Machine Learning Specialty', issuer: 'Amazon Web Services', year: '2024', icon: '☁️' },
        { id: 'cert_2', title: 'TensorFlow Developer Certificate', issuer: 'Google', year: '2023', icon: '🧠' }
      ]

      setProjects(savedProjects ? JSON.parse(savedProjects) : exampleProjects)
      setSkills(savedSkills ? JSON.parse(savedSkills) : exampleSkills)
      setProfile(savedProfile ? JSON.parse(savedProfile) : exampleProfile)
      setCertifications(savedCertifications ? JSON.parse(savedCertifications) : exampleCertifications)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      })
    }
  }, [toast])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      if (state.user) {
        loadData()
      }
    })
    return unsubscribe
  }, [loadData])

  const handleAdminAccess = () => {
    if (!user) {
      // If not authenticated, trigger login
      blink.auth.login()
    } else {
      // If authenticated, open admin panel
      setIsOpen(true)
    }
  }

  const saveProject = async (projectData: Partial<Project>) => {
    try {
      const newProject = {
        ...projectData,
        id: editingProject?.id || `proj_${Date.now()}`,
        userId: user.id
      } as Project

      let updatedProjects
      if (editingProject) {
        updatedProjects = projects.map(p => p.id === editingProject.id ? newProject : p)
        toast({ title: "Éxito", description: "Proyecto actualizado" })
      } else {
        updatedProjects = [...projects, newProject]
        toast({ title: "Éxito", description: "Proyecto creado" })
      }
      
      setProjects(updatedProjects)
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects))
      
      setShowProjectForm(false)
      setEditingProject(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el proyecto",
        variant: "destructive"
      })
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const updatedProjects = projects.filter(p => p.id !== id)
      setProjects(updatedProjects)
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects))
      toast({ title: "Éxito", description: "Proyecto eliminado" })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el proyecto",
        variant: "destructive"
      })
    }
  }

  const saveSkill = async (skillData: Partial<Skill>) => {
    try {
      const newSkill = {
        ...skillData,
        id: editingSkill?.id || `skill_${Date.now()}`,
        userId: user.id
      } as Skill

      let updatedSkills
      if (editingSkill) {
        updatedSkills = skills.map(s => s.id === editingSkill.id ? newSkill : s)
        toast({ title: "Éxito", description: "Skill actualizada" })
      } else {
        updatedSkills = [...skills, newSkill]
        toast({ title: "Éxito", description: "Skill creada" })
      }
      
      setSkills(updatedSkills)
      localStorage.setItem('portfolio_skills', JSON.stringify(updatedSkills))
      
      setShowSkillForm(false)
      setEditingSkill(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la skill",
        variant: "destructive"
      })
    }
  }

  const deleteSkill = async (id: string) => {
    try {
      const updatedSkills = skills.filter(s => s.id !== id)
      setSkills(updatedSkills)
      localStorage.setItem('portfolio_skills', JSON.stringify(updatedSkills))
      toast({ title: "Éxito", description: "Skill eliminada" })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la skill",
        variant: "destructive"
      })
    }
  }

  const saveProfile = async (profileData: Partial<ProfileInfo>) => {
    try {
      const updatedProfile = {
        ...profile,
        ...profileData,
        id: profile?.id || `profile_${Date.now()}`,
        userId: user.id
      } as ProfileInfo
      
      setProfile(updatedProfile)
      localStorage.setItem('portfolio_profile', JSON.stringify(updatedProfile))
      toast({ title: "Éxito", description: "Perfil actualizado" })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive"
      })
    }
  }

  const saveCertification = async (certData: Partial<Certification>) => {
    try {
      const newCert = {
        ...certData,
        id: editingCert?.id || `cert_${Date.now()}`,
        userId: user.id
      } as Certification

      let updatedCerts
      if (editingCert) {
        updatedCerts = certifications.map(c => c.id === editingCert.id ? newCert : c)
        toast({ title: "Éxito", description: "Certificación actualizada" })
      } else {
        updatedCerts = [...certifications, newCert]
        toast({ title: "Éxito", description: "Certificación creada" })
      }
      
      setCertifications(updatedCerts)
      localStorage.setItem('portfolio_certifications', JSON.stringify(updatedCerts))
      
      setShowCertForm(false)
      setEditingCert(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la certificación",
        variant: "destructive"
      })
    }
  }

  const deleteCertification = async (id: string) => {
    try {
      const updatedCerts = certifications.filter(c => c.id !== id)
      setCertifications(updatedCerts)
      localStorage.setItem('portfolio_certifications', JSON.stringify(updatedCerts))
      toast({ title: "Éxito", description: "Certificación eliminada" })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la certificación",
        variant: "destructive"
      })
    }
  }

  // Always show the admin button - authentication happens on click
  const adminButton = (
    <Button
      className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary/80 animate-glow"
      size="lg"
      onClick={handleAdminAccess}
    >
      <Settings className="w-5 h-5 mr-2" />
      {user ? t('admin.admin_panel') : 'Admin Access'}
    </Button>
  )

  // If loading or not authenticated, just show the button
  if (loading || !user) {
    return adminButton
  }

  return (
    <>
      {adminButton}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t('admin.admin_panel')}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    blink.auth.logout()
                    setIsOpen(false)
                  }}
                >
                  {t('admin.logout')}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('admin.profile')}
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {t('admin.projects')}
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                {t('admin.skills')}
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                {t('admin.certifications')}
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <ProfileForm profile={profile} onSave={saveProfile} />
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Mis Proyectos</h3>
                <Button onClick={() => setShowProjectForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Proyecto
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={(p) => {
                      setEditingProject(p)
                      setShowProjectForm(true)
                    }}
                    onDelete={deleteProject}
                  />
                ))}
              </div>

              {showProjectForm && (
                <ProjectForm
                  project={editingProject}
                  onSave={saveProject}
                  onCancel={() => {
                    setShowProjectForm(false)
                    setEditingProject(null)
                  }}
                />
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Mis Skills</h3>
                <Button onClick={() => setShowSkillForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Skill
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {skills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onEdit={(s) => {
                      setEditingSkill(s)
                      setShowSkillForm(true)
                    }}
                    onDelete={deleteSkill}
                  />
                ))}
              </div>

              {showSkillForm && (
                <SkillForm
                  skill={editingSkill}
                  onSave={saveSkill}
                  onCancel={() => {
                    setShowSkillForm(false)
                    setEditingSkill(null)
                  }}
                />
              )}
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Mis Certificaciones</h3>
                <Button onClick={() => setShowCertForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Certificación
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {certifications.map((cert) => (
                  <CertificationCard
                    key={cert.id}
                    certification={cert}
                    onEdit={(c) => {
                      setEditingCert(c)
                      setShowCertForm(true)
                    }}
                    onDelete={deleteCertification}
                  />
                ))}
              </div>

              {showCertForm && (
                <CertificationForm
                  certification={editingCert}
                  onSave={saveCertification}
                  onCancel={() => {
                    setShowCertForm(false)
                    setEditingCert(null)
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Componentes auxiliares
function ProfileForm({ profile, onSave }: { profile: ProfileInfo | null, onSave: (data: Partial<ProfileInfo>) => void }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    title: profile?.title || '',
    description: profile?.description || '',
    resumeUrl: profile?.resumeUrl || '',
    githubUrl: profile?.githubUrl || '',
    linkedinUrl: profile?.linkedinUrl || '',
    email: profile?.email || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tu nombre completo"
          />
        </div>
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="AI & Data Science Visionary"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción profesional..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <Label htmlFor="resumeUrl">URL del CV</Label>
          <Input
            id="resumeUrl"
            value={formData.resumeUrl}
            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input
            id="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Guardar Perfil
      </Button>
    </form>
  )
}

function ProjectCard({ project, onEdit, onDelete }: { 
  project: Project, 
  onEdit: (project: Project) => void, 
  onDelete: (id: string) => void 
}) {
  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm">{project.title}</CardTitle>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(project)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(project.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <Badge variant={project.featured ? "default" : "secondary"}>
          {project.category}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectForm({ project, onSave, onCancel }: {
  project: Project | null,
  onSave: (data: Partial<Project>) => void,
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    longDescription: project?.longDescription || '',
    category: project?.category || 'ML',
    technologies: project?.technologies || [],
    imageUrl: project?.imageUrl || '',
    demoUrl: project?.demoUrl || '',
    githubUrl: project?.githubUrl || '',
    featured: project?.featured || false
  })

  const [techInput, setTechInput] = useState('')

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ML">ML</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción corta</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="longDescription">Descripción larga</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label>Tecnologías</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Agregar tecnología"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <Button type="button" onClick={addTechnology}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTechnology(tech)}>
                  {tech} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="imageUrl">URL de imagen</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="demoUrl">URL de demo</Label>
              <Input
                id="demoUrl"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="githubUrl">URL de GitHub</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Proyecto destacado</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function SkillCard({ skill, onEdit, onDelete }: { 
  skill: Skill, 
  onEdit: (skill: Skill) => void, 
  onDelete: (id: string) => void 
}) {
  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm flex items-center gap-2">
            <span>{skill.icon}</span>
            {skill.name}
          </CardTitle>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(skill)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(skill.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="mb-2">{skill.category}</Badge>
        <div className="text-sm text-muted-foreground">Nivel: {skill.level}%</div>
      </CardContent>
    </Card>
  )
}

function SkillForm({ skill, onSave, onCancel }: {
  skill: Skill | null,
  onSave: (data: Partial<Skill>) => void,
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    level: skill?.level || 50,
    category: skill?.category || 'Programming',
    icon: skill?.icon || '⚡'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{skill ? 'Editar Skill' : 'Nueva Skill'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="icon">Icono (emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="⚡"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="ML/AI">ML/AI</SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                  <SelectItem value="Data">Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="level">Nivel ({formData.level}%)</Label>
              <Input
                id="level"
                type="range"
                min="0"
                max="100"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function CertificationCard({ certification, onEdit, onDelete }: { 
  certification: Certification, 
  onEdit: (cert: Certification) => void, 
  onDelete: (id: string) => void 
}) {
  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm flex items-center gap-2">
            <span>{certification.icon}</span>
            {certification.title}
          </CardTitle>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(certification)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(certification.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-1">{certification.issuer}</p>
        <Badge variant="secondary">{certification.year}</Badge>
      </CardContent>
    </Card>
  )
}

function CertificationForm({ certification, onSave, onCancel }: {
  certification: Certification | null,
  onSave: (data: Partial<Certification>) => void,
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: certification?.title || '',
    issuer: certification?.issuer || '',
    year: certification?.year || new Date().getFullYear().toString(),
    icon: certification?.icon || '🏆'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{certification ? 'Editar Certificación' : 'Nueva Certificación'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="icon">Icono (emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🏆"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issuer">Emisor</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}