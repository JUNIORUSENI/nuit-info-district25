'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { GameState, RoleType, Choice, Scenario } from '../types/game';
import { getScenarioForPosition, getQuestionCountForRole } from '../data/questionsHelper';
import { getRandomTerminalForRole, TerminalChallenge } from '../data/terminals';

interface GameContextType {
    gameState: GameState;
    selectRole: (role: RoleType) => void;
    makeChoice: (choice: Choice) => void;
    completeTerminal: (challenge: TerminalChallenge) => void;
    nextScenario: () => void;
    getCurrentScenario: () => Scenario | null;
    getTerminalChallenge: () => TerminalChallenge | null;
    resetGame: () => void;
    shouldShowTerminal: () => boolean;
    getTotalQuestions: () => number;
    updateScore: (impact: { money: number; co2: number; nird: number }) => void;
}

const initialState: GameState = {
    role: null,
    currentScenarioIndex: 0,
    score: {
        money: 0,
        co2: 0,
        nird: 0,
    },
    avatarLevel: 1,
    decisions: [],
    isGameOver: false,
    terminalCompleted: 0,
};

// Générer la clé localStorage pour un rôle spécifique
const getStorageKey = (roleId: RoleType): string => `nird-game-state-${roleId}`;

// Charger l'état depuis localStorage pour un rôle spécifique
const loadStateFromStorage = (roleId: RoleType | null): GameState => {
    if (typeof window === 'undefined' || !roleId) return initialState;

    try {
        const saved = localStorage.getItem(getStorageKey(roleId));
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...initialState, ...parsed, role: roleId };
        }
    } catch (e) {
        console.error('Erreur de chargement localStorage:', e);
    }
    return { ...initialState, role: roleId };
};

// Sauvegarder l'état dans localStorage pour le rôle actuel
const saveStateToStorage = (state: GameState) => {
    if (typeof window === 'undefined' || !state.role) return;

    try {
        localStorage.setItem(getStorageKey(state.role), JSON.stringify(state));
    } catch (e) {
        console.error('Erreur de sauvegarde localStorage:', e);
    }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [gameState, setGameState] = useState<GameState>(initialState);
    const [isHydrated, setIsHydrated] = useState(false);

    // Charger l'état depuis localStorage au montage (si un rôle était sauvegardé)
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Sauvegarder dans localStorage à chaque changement
    useEffect(() => {
        if (isHydrated && gameState.role) {
            saveStateToStorage(gameState);
        }
    }, [gameState, isHydrated]);

    const selectRole = useCallback((role: RoleType) => {
        // Charger l'état sauvegardé pour ce rôle spécifique
        const savedState = loadStateFromStorage(role);
        setGameState({
            ...savedState,
            role,
            // Réinitialiser la progression si le jeu était terminé
            currentScenarioIndex: savedState.isGameOver ? 0 : savedState.currentScenarioIndex,
            isGameOver: false,
        });
    }, []);

    const updateScore = useCallback((impact: { money: number; co2: number; nird: number }) => {
        setGameState((prev) => {
            const newScore = {
                money: prev.score.money + impact.money,
                co2: prev.score.co2 + impact.co2,
                nird: prev.score.nird + impact.nird,
            };
            return {
                ...prev,
                score: newScore,
            };
        });
    }, []);

    const makeChoice = useCallback((choice: Choice) => {
        setGameState((prev) => {
            const newScore = {
                money: prev.score.money + choice.impact.money,
                co2: prev.score.co2 + choice.impact.co2,
                nird: prev.score.nird + choice.impact.nird,
            };

            // Calculer le niveau d'avatar (6 niveaux = 1 par question)
            let newAvatarLevel = prev.avatarLevel;
            if (choice.isGoodChoice && newAvatarLevel < 6) {
                newAvatarLevel++;
            } else if (!choice.isGoodChoice && newAvatarLevel > 1) {
                newAvatarLevel--;
            }

            // Passer à la question suivante
            const nextIndex = prev.currentScenarioIndex + 1;
            const isGameOver = nextIndex >= 6; // Toujours 6 questions

            console.log('Choice made:', choice.id, 'Impact:', choice.impact, 'New score:', newScore, 'Next index:', nextIndex);

            return {
                ...prev,
                score: newScore,
                avatarLevel: newAvatarLevel,
                decisions: [...prev.decisions, choice.id],
                currentScenarioIndex: nextIndex,
                isGameOver: isGameOver,
            };
        });
    }, []);

    const completeTerminal = useCallback((challenge: TerminalChallenge) => {
        setGameState((prev) => ({
            ...prev,
            score: {
                money: prev.score.money + challenge.impact.money,
                co2: prev.score.co2 + challenge.impact.co2,
                nird: prev.score.nird + challenge.impact.nird,
            },
            avatarLevel: Math.min(6, prev.avatarLevel + 1),
            terminalCompleted: prev.terminalCompleted + 1,
        }));
    }, []);


    const getTotalQuestions = useCallback(() => {
        return 6; // Toujours 6 questions par partie
    }, []);

    const nextScenario = useCallback(() => {
        setGameState((prev) => {
            if (!prev.role) return prev;

            const totalQuestions = getQuestionCountForRole(prev.role);
            const nextIndex = prev.currentScenarioIndex + 1;

            if (nextIndex >= totalQuestions) {
                return {
                    ...prev,
                    isGameOver: true,
                };
            }

            return {
                ...prev,
                currentScenarioIndex: nextIndex,
            };
        });
    }, []);

    const getCurrentScenario = useCallback((): Scenario | null => {
        if (!gameState.role) return null;
        // Position = index + 1 (1-based)
        const position = gameState.currentScenarioIndex + 1;
        return getScenarioForPosition(gameState.role, position, gameState.decisions);
    }, [gameState.role, gameState.currentScenarioIndex, gameState.decisions]);

    const getTerminalChallenge = useCallback(() => {
        if (!gameState.role) return null;
        return getRandomTerminalForRole(gameState.role);
    }, [gameState.role]);

    const shouldShowTerminal = useCallback(() => {
        const terminalTriggers = [2, 4];
        return terminalTriggers.includes(gameState.currentScenarioIndex) &&
            gameState.terminalCompleted < terminalTriggers.filter(t => t <= gameState.currentScenarioIndex).length;
    }, [gameState.currentScenarioIndex, gameState.terminalCompleted]);

    const resetGame = useCallback(() => {
        const newState = {
            ...initialState,
            role: gameState.role,
        };
        setGameState(newState);
        saveStateToStorage(newState);
    }, [gameState.role]);

    return (
        <GameContext.Provider
            value={{
                gameState,
                selectRole,
                makeChoice,
                completeTerminal,
                nextScenario,
                getCurrentScenario,
                getTerminalChallenge,
                resetGame,
                shouldShowTerminal,
                getTotalQuestions,
                updateScore,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
