import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { useLanguage } from '../contexts/LanguageContext'

interface Skill {
  name: string
  level: number
  category: 'Programming' | 'ML/AI' | 'Tools' | 'Data'
  icon: string
}

const skills: Skill[] = [
  // Programming
  { name: 'Python', level: 95, category: 'Programming', icon: '🐍' },
  { name: 'R', level: 85, category: 'Programming', icon: '📊' },
  { name: 'JavaScript', level: 80, category: 'Programming', icon: '⚡' },
  { name: 'SQL', level: 90, category: 'Programming', icon: '🗃️' },
  { name: 'Java', level: 75, category: 'Programming', icon: '☕' },
  
  // ML/AI
  { name: 'TensorFlow', level: 90, category: 'ML/AI', icon: '🧠' },
  { name: 'PyTorch', level: 85, category: 'ML/AI', icon: '🔥' },
  { name: 'Scikit-learn', level: 95, category: 'ML/AI', icon: '🤖' },
  { name: 'Keras', level: 88, category: 'ML/AI', icon: '⚡' },
  { name: 'OpenCV', level: 82, category: 'ML/AI', icon: '👁️' },
  
  // Tools
  { name: 'Docker', level: 80, category: 'Tools', icon: '🐳' },
  { name: 'Git', level: 90, category: 'Tools', icon: '🌿' },
  { name: 'AWS', level: 75, category: 'Tools', icon: '☁️' },
  { name: 'Jupyter', level: 95, category: 'Tools', icon: '📓' },
  { name: 'Linux', level: 85, category: 'Tools', icon: '🐧' },
  
  // Data
  { name: 'Pandas', level: 95, category: 'Data', icon: '🐼' },
  { name: 'NumPy', level: 90, category: 'Data', icon: '🔢' },
  { name: 'Matplotlib', level: 85, category: 'Data', icon: '📈' },
  { name: 'Seaborn', level: 80, category: 'Data', icon: '🎨' },
  { name: 'Apache Spark', level: 70, category: 'Data', icon: '⚡' }
]

export function SkillsSection() {
  const { t } = useLanguage()
  const [visibleSkills, setVisibleSkills] = useState<Set<string>>(new Set())
  const sectionRef = useRef<HTMLDivElement>(null)

  const categories = [
    { key: 'Programming', label: t('skills.programming') },
    { key: 'ML/AI', label: t('skills.ml_ai') },
    { key: 'Tools', label: t('skills.tools') },
    { key: 'Data', label: t('skills.data') }
  ] as const

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skillName = entry.target.getAttribute('data-skill')
            if (skillName) {
              setVisibleSkills(prev => new Set([...prev, skillName]))
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    const skillElements = sectionRef.current?.querySelectorAll('[data-skill]')
    skillElements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">{t('skills.title')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('skills.description')}
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Card key={category.key} className="glass hover-lift">
              <CardHeader>
                <CardTitle className="text-xl text-center text-primary">
                  {category.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills
                  .filter(skill => skill.category === category.key)
                  .map((skill) => (
                    <div 
                      key={skill.name} 
                      className="space-y-2"
                      data-skill={skill.name}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{skill.icon}</span>
                          <span className="font-medium text-sm">{skill.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                          {skill.level}%
                        </Badge>
                      </div>
                      <Progress 
                        value={visibleSkills.has(skill.name) ? skill.level : 0}
                        className="h-2"
                      />
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Skills Tags */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-primary mb-8">{t('skills.additional')}</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              'Neural Networks', 'Deep Learning', 'Computer Vision', 'NLP', 'Time Series',
              'Reinforcement Learning', 'MLOps', 'Data Visualization', 'Statistical Analysis',
              'Big Data', 'Cloud Computing', 'API Development', 'Database Design',
              'Agile Methodology', 'Research & Development'
            ].map((tech) => (
              <Badge 
                key={tech} 
                variant="outline" 
                className="px-4 py-2 text-sm border-accent/30 text-accent hover:bg-accent/10 transition-colors cursor-default"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-primary mb-8 text-center">{t('skills.certifications')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'AWS Certified Machine Learning',
                issuer: 'Amazon Web Services',
                year: '2024',
                icon: '🏆'
              },
              {
                title: 'TensorFlow Developer Certificate',
                issuer: 'Google',
                year: '2023',
                icon: '🥇'
              },
              {
                title: 'Data Science Specialization',
                issuer: 'Johns Hopkins University',
                year: '2023',
                icon: '🎓'
              }
            ].map((cert) => (
              <Card key={cert.title} className="glass hover-lift text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{cert.icon}</div>
                  <h4 className="font-semibold text-lg mb-2">{cert.title}</h4>
                  <p className="text-muted-foreground text-sm mb-1">{cert.issuer}</p>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {cert.year}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}