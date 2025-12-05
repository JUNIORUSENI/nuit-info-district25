import { Scenario, Choice, RoleType } from '../types/game';
import questionsData from './questions.json';

export interface QuestionChoice {
    id: string;
    text: string;
    consequence: string;
    isGoodChoice: boolean;
    impact: {
        money: number;
        co2: number;
        nird: number;
    };
    nextBranch?: string; // Branche pour les questions suivantes
}

export interface Question {
    id: string;
    title: string;
    situation: string;
    choices: QuestionChoice[];
}

export interface RoleQuestions {
    roleId: string;
    roleName: string;
    questions: Question[];
}

// Type pour les données JSON
type QuestionsJSON = {
    [key in RoleType]: RoleQuestions;
};

const questions = questionsData as QuestionsJSON;

// Configuration des questions par position (1-6) pour chaque rôle
// Les variantes sont regroupées par position
const QUESTION_STRUCTURE: Record<RoleType, { position: number; ids: string[] }[]> = {
    directeur: [
        { position: 1, ids: ['dir-1'] },
        { position: 2, ids: ['dir-2'] },
        { position: 3, ids: ['dir-3'] },
        { position: 4, ids: ['dir-4'] },
        { position: 5, ids: ['dir-5'] },
        { position: 6, ids: ['dir-6'] },
    ],
    technicien: [
        { position: 1, ids: ['tech-1'] },
        { position: 2, ids: ['tech-2'] },
        { position: 3, ids: ['tech-3'] },
        { position: 4, ids: ['tech-4'] },
        { position: 5, ids: ['tech-5'] },
        { position: 6, ids: ['tech-6'] },
    ],
    eleve: [
        { position: 1, ids: ['eleve-1'] },
        { position: 2, ids: ['eleve-2'] },
        { position: 3, ids: ['eleve-3'] },
        { position: 4, ids: ['eleve-4-linux', 'eleve-4-mac', 'eleve-4-windows'] }, // Branches
        { position: 5, ids: ['eleve-5-linux', 'eleve-5-other'] }, // Branches
        { position: 6, ids: ['eleve-6'] },
    ],
    parent: [
        { position: 1, ids: ['parent-1'] },
        { position: 2, ids: ['parent-2'] },
        { position: 3, ids: ['parent-3-linux', 'parent-3-windows'] }, // Branches
        { position: 4, ids: ['parent-4'] },
        { position: 5, ids: ['parent-5'] },
        { position: 6, ids: ['parent-6'] },
    ],
};

// Mapping des choix vers les branches
const BRANCH_MAPPING: Record<string, string> = {
    // Élève Q1 : choix détermine la branche pour Q4 et Q5
    'eleve-1-a': 'mac',     // MacBook → mac
    'eleve-1-b': 'windows', // Garder Windows → windows
    'eleve-1-c': 'linux',   // Installer Linux → linux
    // Parent Q1 : choix détermine la branche pour Q3
    'parent-1-a': 'windows', // Crédit → windows
    'parent-1-b': 'windows', // PC premier prix → windows
    'parent-1-c': 'linux',   // ThinkPad + Linux → linux
};

/**
 * Récupère toutes les questions brutes pour un rôle donné
 */
export function getQuestionsForRole(roleId: RoleType): Question[] {
    const roleData = questions[roleId];
    if (!roleData) {
        console.warn(`Aucune question trouvée pour le rôle: ${roleId}`);
        return [];
    }
    return roleData.questions;
}

/**
 * Détermine la branche active basée sur l'historique des décisions
 */
export function getBranchFromDecisions(decisions: string[]): string {
    // Chercher dans les décisions si un choix détermine une branche
    for (const decision of decisions) {
        if (BRANCH_MAPPING[decision]) {
            return BRANCH_MAPPING[decision];
        }
    }
    return 'linux'; // Branche par défaut
}

/**
 * Récupère la question appropriée pour une position donnée (1-6)
 */
export function getQuestionForPosition(
    roleId: RoleType,
    position: number,
    decisions: string[]
): Question | null {
    const structure = QUESTION_STRUCTURE[roleId];
    if (!structure || position < 1 || position > 6) return null;

    const positionConfig = structure.find(p => p.position === position);
    if (!positionConfig) return null;

    const allQuestions = getQuestionsForRole(roleId);
    const branch = getBranchFromDecisions(decisions);

    // Si une seule question pour cette position, la retourner
    if (positionConfig.ids.length === 1) {
        return allQuestions.find(q => q.id === positionConfig.ids[0]) || null;
    }

    // Sinon, chercher la question correspondant à la branche
    // D'abord essayer de trouver la question avec le suffixe de branche
    const branchId = positionConfig.ids.find(id => id.includes(`-${branch}`));
    if (branchId) {
        const question = allQuestions.find(q => q.id === branchId);
        if (question) return question;
    }

    // Si pas de match exact, chercher 'other' comme fallback
    const otherId = positionConfig.ids.find(id => id.includes('-other'));
    if (otherId) {
        const question = allQuestions.find(q => q.id === otherId);
        if (question) return question;
    }

    // Dernier recours : prendre la première option disponible
    const firstId = positionConfig.ids[0];
    return allQuestions.find(q => q.id === firstId) || null;
}

/**
 * Convertit une Question en Scenario
 */
export function questionToScenario(question: Question, roleId: RoleType): Scenario {
    return {
        id: question.id,
        roleId: roleId,
        title: question.title,
        situation: question.situation,
        choices: question.choices.map((choice): Choice => ({
            id: choice.id,
            text: choice.text,
            consequence: choice.consequence,
            isGoodChoice: choice.isGoodChoice,
            impact: choice.impact,
        })),
    };
}

/**
 * Récupère le scénario pour la position donnée
 */
export function getScenarioForPosition(
    roleId: RoleType,
    position: number,
    decisions: string[]
): Scenario | null {
    const question = getQuestionForPosition(roleId, position, decisions);
    if (!question) return null;
    return questionToScenario(question, roleId);
}

/**
 * Récupère tous les scénarios pour un rôle (6 questions)
 * Note: Cette fonction retourne les 6 premières questions sans tenir compte des branches
 * Pour les branches, utilisez getScenarioForPosition
 */
export function getScenariosForRole(roleId: RoleType): Scenario[] {
    const scenarios: Scenario[] = [];
    for (let i = 1; i <= 6; i++) {
        const question = getQuestionForPosition(roleId, i, []);
        if (question) {
            scenarios.push(questionToScenario(question, roleId));
        }
    }
    return scenarios;
}

/**
 * Toujours retourne 6 (nombre fixe de questions par partie)
 */
export function getQuestionCountForRole(_roleId: RoleType): number {
    return 6;
}

/**
 * Récupère le nom du rôle
 */
export function getRoleName(roleId: RoleType): string {
    const roleData = questions[roleId];
    return roleData?.roleName || roleId;
}

export default questions;
