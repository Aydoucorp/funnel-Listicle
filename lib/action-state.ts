// Etat partage par les formulaires du back-office.
// Il vit hors du fichier "use server", qui ne peut exporter que des fonctions async.
export type ActionState = { status: 'idle' | 'error' | 'success'; message: string }

export const initialActionState: ActionState = { status: 'idle', message: '' }
