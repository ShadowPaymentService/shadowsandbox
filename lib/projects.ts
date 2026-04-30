import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Project, ProjectFile, ProjectType, PROJECT_TEMPLATES } from './types'

const PROJECTS_COLLECTION = 'projects'

export async function createProject(
  userId: string, 
  name: string, 
  type: ProjectType,
  description?: string
): Promise<string> {
  const template = PROJECT_TEMPLATES[type]
  
  const projectData = {
    name,
    type,
    userId,
    description: description || template.description,
    files: template.defaultFiles,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  
  const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectData)
  return docRef.id
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const q = query(
    collection(db, PROJECTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    } as Project
  })
}

export async function getProject(projectId: string): Promise<Project | null> {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId)
  const snapshot = await getDoc(docRef)
  
  if (!snapshot.exists()) return null
  
  const data = snapshot.data()
  return {
    id: snapshot.id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  } as Project
}

export async function updateProject(
  projectId: string, 
  updates: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function updateProjectFiles(
  projectId: string, 
  files: ProjectFile[]
): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId)
  await updateDoc(docRef, {
    files,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProject(projectId: string): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId)
  await deleteDoc(docRef)
}

export async function cloneFromGithub(
  userId: string,
  repoUrl: string,
  name: string
): Promise<string> {
  // In a real implementation, you would fetch the repo contents via GitHub API
  // For now, create a project with the URL stored
  const projectData = {
    name,
    type: 'nodejs' as ProjectType,
    userId,
    description: `Cloned from ${repoUrl}`,
    githubUrl: repoUrl,
    files: [
      {
        id: '1',
        name: 'README.md',
        path: '/README.md',
        content: `# ${name}\n\nCloned from: ${repoUrl}\n\nNote: In a production environment, this would fetch actual repository contents.`,
        language: 'markdown',
      }
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  
  const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectData)
  return docRef.id
}
