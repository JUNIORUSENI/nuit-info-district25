'use client';

import { useGame } from '../contexts/GameContext';
import { roles } from '../data/roles';
import Image from 'next/image';

interface ResultScreenProps {
    onRestart: () => void;
}

// Images finales par rôle (niveau max)
const finalAvatars: Record<string, string> = {
    directeur: '/assets/avatars/DIRECTEUR6.png',
    technicien: '/assets/avatars/TECH6.png',
    eleve: '/assets/avatars/ELEVE6.png',
    parent: '/assets/avatars/PARENT6.png',
};

// Messages de fin personnalisés par rôle
const endMessages: Record<string, { victory: string; defeat: string; subtitle: string }> = {
    directeur: {
        victory: '🏛️ Votre établissement est devenu un modèle national !',
        defeat: 'Le budget est épuisé... Mais la prochaine année peut tout changer !',
        subtitle: 'Votre vision a transformé l\'école en village numérique libre et durable.',
    },
    technicien: {
        victory: '🔧 Vous êtes devenu l\'Architecte de l\'infrastructure !',
        defeat: 'Les serveurs tiennent... mais on peut faire mieux.',
        subtitle: 'Vos scripts d\'automatisation et votre maîtrise de Linux font école.',
    },
    eleve: {
        victory: '🎓 Tu es le Héros de ta génération !',
        defeat: 'Tu as appris des choses, continue ton chemin !',
        subtitle: 'Tu maîtrises le terminal, tu partages tes connaissances, tu es libre.',
    },
    parent: {
        victory: '🏠 Votre famille est devenue un exemple d\'autonomie !',
        defeat: 'Quelques erreurs, mais l\'essentiel est transmis.',
        subtitle: 'Vos enfants savent réparer, protéger leur vie privée et créer.',
    },
};

export default function ResultScreen({ onRestart }: ResultScreenProps) {
    const { gameState } = useGame();
    const { score, avatarLevel, role } = gameState;

    const totalScore = score.nird;
    const isVictory = totalScore >= 100;
    const selectedRole = roles.find(r => r.id === role);
    const roleId = role || 'directeur';
    const messages = endMessages[roleId] || endMessages.directeur;
    const finalAvatar = finalAvatars[roleId] || finalAvatars.directeur;

    const learnedCommands = [
        { cmd: 'htop', desc: 'Analyser les processus' },
        { cmd: 'sudo apt update', desc: 'Mettre à jour les paquets' },
        { cmd: 'sudo apt install', desc: 'Installer des logiciels' },
        { cmd: 'ansible-playbook', desc: 'Déployer en masse' },
        { cmd: 'sudo iftop', desc: 'Monitorer le réseau' },
    ];

    return (
        <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Grille de fond */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(0, 255, 136, 0.2) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 136, 0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Particules de célébration */}
            {isVictory && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute text-3xl animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${3 + Math.random() * 2}s`,
                            }}
                        >
                            {['✨', '🌟', '💚', '🐧', '🌿', '🏆'][Math.floor(Math.random() * 6)]}
                        </div>
                    ))}
                </div>
            )}

            {/* Carte principale */}
            <div className="max-w-3xl w-full bg-[#1a1a1a] rounded-3xl border border-[#2a2a2a] p-8 relative z-10 animate-fadeIn">
                {/* Avatar final et titre */}
                <div className="text-center mb-8">
                    {/* Image Avatar finale - carrée */}
                    <div className="relative mx-auto mb-6">
                        {/* Glow */}
                        <div className={`absolute inset-0 rounded-2xl blur-2xl ${isVictory ? 'bg-[#00ff88]' : 'bg-gray-500'} opacity-30`}
                            style={{ transform: 'scale(0.7)' }}
                        />
                        <div className={`relative w-40 h-40 mx-auto rounded-2xl border-4 overflow-hidden
                            ${isVictory
                                ? 'border-[#00ff88] shadow-[0_0_40px_rgba(0,255,136,0.5)] animate-pulse'
                                : 'border-gray-600'}`}>
                            <Image
                                src={finalAvatar}
                                alt={`Avatar final ${selectedRole?.title}`}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Badge de niveau */}
                        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full 
                            text-sm font-bold ${isVictory
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                                : 'bg-gray-700 text-gray-300'}`}>
                            {isVictory ? '👑 LÉGENDE' : `Niv. ${avatarLevel}/6`}
                        </div>
                    </div>

                    <h1 className={`text-4xl font-black mb-3 ${isVictory ? 'neon-text' : 'text-white'}`}>
                        {isVictory ? 'MISSION ACCOMPLIE !' : 'Fin du parcours'}
                    </h1>

                    <p className="text-xl text-[#00ff88] font-medium mb-2">
                        {isVictory ? messages.victory : messages.defeat}
                    </p>

                    {isVictory && (
                        <p className="text-gray-400 max-w-md mx-auto">
                            {messages.subtitle}
                        </p>
                    )}

                    {selectedRole && (
                        <p className="text-sm text-gray-500 mt-4">
                            <span className="text-2xl">{selectedRole.emoji}</span> {selectedRole.title}
                        </p>
                    )}
                </div>

                {/* Stats finales */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className={`bg-[#0d0d0d] rounded-2xl p-5 text-center border-2 transition-all ${score.money > 0 ? 'border-[#00ff88]' : 'border-red-500/50'}`}>
                        <div className="text-3xl mb-2">💰</div>
                        <div className={`text-3xl font-black ${score.money >= 0 ? 'text-[#00ff88]' : 'text-red-500'}`}>
                            {score.money >= 0 ? '+' : ''}{score.money.toLocaleString('fr-FR')}€
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Budget</div>
                    </div>

                    <div className={`bg-[#0d0d0d] rounded-2xl p-5 text-center border-2 transition-all ${score.co2 > 0 ? 'border-[#00ff88]' : 'border-orange-500/50'}`}>
                        <div className="text-3xl mb-2">🌍</div>
                        <div className={`text-3xl font-black ${score.co2 >= 0 ? 'text-[#00ff88]' : 'text-orange-500'}`}>
                            {score.co2 >= 0 ? '+' : ''}{score.co2}kg
                        </div>
                        <div className="text-xs text-gray-500 mt-2">CO₂ évité</div>
                    </div>

                    <div className={`bg-[#0d0d0d] rounded-2xl p-5 text-center border-2 transition-all ${score.nird >= 100 ? 'border-[#00ff88]' : 'border-[#2a2a2a]'}`}>
                        <div className="text-3xl mb-2">⚡</div>
                        <div className="text-3xl font-black text-[#00ff88]">
                            {score.nird}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Points NIRD</div>
                    </div>
                </div>

                {/* Bilan écologique - seulement en victoire */}
                {isVictory && (
                    <div className="bg-gradient-to-r from-[#00ff88]/10 to-[#00ff88]/5 rounded-2xl p-6 mb-8 border border-[#00ff88]/30">
                        <h3 className="text-[#00ff88] font-bold text-lg mb-4 flex items-center gap-2">
                            <span>🌿</span> Ton impact sur la planète
                        </h3>
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-4xl font-black text-white">
                                    {Math.max(1, Math.round(score.co2 / 10))}
                                </div>
                                <div className="text-sm text-gray-400">🌳 arbres plantés</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-white">
                                    {Math.max(1, Math.round(score.money / 500))}
                                </div>
                                <div className="text-sm text-gray-400">💻 PC sauvés</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-white">
                                    {Math.max(1, Math.round(score.co2 / 50))}
                                </div>
                                <div className="text-sm text-gray-400">🚗 trajets évités</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cheat Sheet Linux */}
                <div className="bg-[#0d0d0d] rounded-2xl p-5 mb-8 border border-[#2a2a2a]">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="text-xl">🐧</span> Ta Cheat Sheet du Résistant
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-sm">
                        {learnedCommands.map((cmd) => (
                            <div key={cmd.cmd} className="flex items-center gap-3 bg-[#1a1a1a] p-3 rounded-xl">
                                <code className="text-[#00ff88] bg-[#00ff88]/10 px-3 py-1 rounded-lg text-xs">
                                    {cmd.cmd}
                                </code>
                                <span className="text-gray-500 text-xs">{cmd.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onRestart}
                        className="flex-1 py-4 px-6 bg-[#00ff88] hover:bg-[#00cc6a] rounded-2xl 
                            text-black font-bold text-lg transition-all duration-300 
                            hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:scale-105"
                    >
                        🔄 Rejouer
                    </button>
                    <a
                        href="https://nird.forge.apps.education.fr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-4 px-6 bg-[#0d0d0d] border-2 border-[#2a2a2a] 
                            hover:border-[#00ff88] rounded-2xl text-white font-bold text-lg text-center
                            transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]"
                    >
                        🌐 Rejoindre NIRD
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-600 text-sm relative z-10">
                <p className="text-lg mb-2">🏴 <span className="text-[#00ff88]">Opération N.I.R.D</span> - Le Village Résiste</p>
                <p className="text-xs">Nuit de l&apos;Info 2025 • Fait avec ❤️ et du Libre</p>
            </div>
        </div>
    );
}
