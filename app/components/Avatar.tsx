'use client';

import { useGame } from '../contexts/GameContext';
import { roles } from '../data/roles';
import Image from 'next/image';

// Mapping des images d'avatars par rôle et niveau (1-6)
const avatarImages: Record<string, string[]> = {
    directeur: [
        '/assets/avatars/DIRECTEUR1.png',
        '/assets/avatars/DIRECTEUR2.png',
        '/assets/avatars/DIRECTEUR3.png',
        '/assets/avatars/DIRECTEUR4.png',
        '/assets/avatars/DIRECTEUR5.png',
        '/assets/avatars/DIRECTEUR6.png',
    ],
    technicien: [
        '/assets/avatars/TECH1.png',
        '/assets/avatars/TECH2.png',
        '/assets/avatars/TECH3.png',
        '/assets/avatars/TECH4.png',
        '/assets/avatars/TECH5.png',
        '/assets/avatars/TECH6.png',
    ],
    eleve: [
        '/assets/avatars/ELEVE1.png',
        '/assets/avatars/ELEVE2.png',
        '/assets/avatars/ELEVE3.png',
        '/assets/avatars/ELEVE4.png',
        '/assets/avatars/ELEVE5.png',
        '/assets/avatars/ELEVE6.png',
    ],
    parent: [
        '/assets/avatars/PARENT1.png',
        '/assets/avatars/PARENT2.png',
        '/assets/avatars/PARENT3.png',
        '/assets/avatars/PARENT4.png',
        '/assets/avatars/PARENT5.png',
        '/assets/avatars/PARENT6.png',
    ],
};

const avatarStates = {
    1: { label: 'Débutant', status: 'Système compromis', color: 'border-red-500' },
    2: { label: 'Initié', status: 'Connexion instable', color: 'border-orange-500' },
    3: { label: 'Apprenti', status: 'Synchronisation...', color: 'border-yellow-500' },
    4: { label: 'Résistant', status: 'IA Optimisée', color: 'border-[#00ff88]' },
    5: { label: 'Héros NIRD', status: 'Mode Légendaire', color: 'border-[#00ff88]' },
    6: { label: 'Légende', status: '🏆 NIRD Master', color: 'border-[#00ff88]' },
};

export default function Avatar() {
    const { gameState } = useGame();
    const level = Math.min(6, Math.max(1, gameState.avatarLevel)); // Clamp entre 1 et 6
    const avatar = avatarStates[level as keyof typeof avatarStates];
    const selectedRole = roles.find(r => r.id === gameState.role);
    const roleId = gameState.role || 'directeur';

    // Récupérer l'image correspondant au niveau (index = level - 1)
    const avatarImage = avatarImages[roleId]?.[level - 1] || avatarImages.directeur[0];

    return (
        <div className="flex flex-col items-center">
            {/* Label du rôle */}
            <p className="text-gray-500 text-sm mb-4">
                Incarnation : <span className="text-[#00ff88]">{selectedRole?.title || 'Directeur'}</span>
            </p>

            {/* Conteneur Avatar */}
            <div className="relative">
                {/* Glow effect */}
                <div
                    className={`absolute inset-0 rounded-2xl blur-xl opacity-50 transition-all duration-500 ${level >= 4 ? 'bg-[#00ff88]' : level >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                    style={{ transform: 'scale(0.8)' }}
                />

                {/* Image carrée avec bordure */}
                <div
                    className={`relative w-48 h-48 rounded-2xl border-4 overflow-hidden 
                        transition-all duration-500 ${avatar.color}
                        ${level >= 4 ? 'shadow-[0_0_30px_rgba(0,255,136,0.5)]' : ''}
                        ${level >= 5 ? 'animate-pulse' : ''}`}
                >
                    <Image
                        src={avatarImage}
                        alt={`Avatar ${selectedRole?.title} niveau ${level}`}
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Overlay scanline effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff88]/5 to-transparent pointer-events-none" />

                    {/* Effet de scan animé */}
                    {level >= 4 && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div
                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-50"
                                style={{ animation: 'scan-line 2s linear infinite' }}
                            />
                        </div>
                    )}
                </div>

                {/* Badge de statut */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                    <div className={`px-4 py-2 rounded-full bg-[#0d0d0d] border-2
                        text-xs font-bold flex items-center gap-2 whitespace-nowrap
                        ${level >= 4
                            ? 'border-[#00ff88] text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.5)]'
                            : 'border-[#2a2a2a] text-gray-400'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${level >= 4 ? 'bg-[#00ff88] animate-pulse' : 'bg-gray-500'}`} />
                        {avatar.status}
                    </div>
                </div>
            </div>

            {/* Barre de progression */}
            <div className="w-full max-w-[200px] mt-8">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span className="font-bold text-white">{avatar.label}</span>
                    <span className="text-[#00ff88]">Niv. {level}/6</span>
                </div>
                <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#2a2a2a]">
                    <div
                        className="h-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a] transition-all duration-700 rounded-full"
                        style={{
                            width: `${(level / 6) * 100}%`,
                            boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                        }}
                    />
                </div>
            </div>

            {/* Badge spécial niveau max */}
            {level >= 5 && (
                <div className={`mt-4 px-5 py-2 rounded-full text-sm font-bold 
                    ${level === 6
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black animate-pulse shadow-[0_0_20px_rgba(255,215,0,0.5)]'
                        : 'bg-[#00ff88] text-black shadow-[0_0_20px_rgba(0,255,136,0.5)]'
                    }`}>
                    {level === 6 ? '👑 Légende Absolue' : '🏆 Résistant Légendaire'}
                </div>
            )}
        </div>
    );
}
