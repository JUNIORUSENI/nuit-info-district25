'use client';

import { useState, useMemo } from 'react';

// Types
interface SimulatorInputs {
    profile: 'ecole' | 'college' | 'lycee' | 'collectivite';
    nbPCs: number;
    avgAge: number;
    hasWindows: boolean;
    hasOffice365: boolean;
    hasAdobe: boolean;
    hasAntivirus: boolean;
    electricityPrice: number;
    yearsProjection: number;
}

interface SimulatorResults {
    windowsSavings: number;
    officeSavings: number;
    adobeSavings: number;
    antivirusSavings: number;
    totalLicenseSavings: number;
    hardwareExtensionSavings: number;
    maintenanceSavings: number;
    reconditioningCost: number;
    totalHardwareSavings: number;
    energySavings: number;
    trainingCost: number;
    co2Avoided: number;
    ewasteAvoided: number;
    treesEquivalent: number;
    totalSavings: number;
    totalCosts: number;
    netSavings: number;
    roiMonths: number;
    pcsToReplace: number;
}

const COSTS = {
    windowsLicense: 145,
    office365PerYear: 70,
    adobePerYear: 600,
    antivirusPerYear: 30,
    pcReplacement: 500,
    pcReconditioning: 50,
    maintenancePerPCPerYear: 80,
    maintenanceReductionLinux: 0.4,
    energyPerPCPerYear: 50,
    energyReductionLinux: 0.15,
    trainingPerTeacher: 200,
    teacherRatio: 0.1,
    co2PerPCPerYear: 50,
    ewastePerPC: 8,
};

const PROFILE_LABELS = {
    ecole: '🏫 École primaire',
    college: '🏛️ Collège',
    lycee: '🎓 Lycée',
    collectivite: '🏢 Mairie / Collectivité',
};

interface CostSimulatorProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CostSimulator({ isOpen, onClose }: CostSimulatorProps) {
    const [inputs, setInputs] = useState<SimulatorInputs>({
        profile: 'college',
        nbPCs: 100,
        avgAge: 5,
        hasWindows: true,
        hasOffice365: true,
        hasAdobe: false,
        hasAntivirus: true,
        electricityPrice: 0.25,
        yearsProjection: 5,
    });

    const [step, setStep] = useState(1);
    const [isLightMode, setIsLightMode] = useState(false);

    const results = useMemo<SimulatorResults>(() => {
        const years = inputs.yearsProjection;
        const pcs = inputs.nbPCs;

        const windowsSavings = inputs.hasWindows ? COSTS.windowsLicense * pcs : 0;
        const officeSavings = inputs.hasOffice365 ? COSTS.office365PerYear * pcs * years : 0;
        const adobeSavings = inputs.hasAdobe ? COSTS.adobePerYear * pcs * years : 0;
        const antivirusSavings = inputs.hasAntivirus ? COSTS.antivirusPerYear * pcs * years : 0;
        const totalLicenseSavings = windowsSavings + officeSavings + adobeSavings + antivirusSavings;

        const pcsToReplace = Math.floor(pcs * (inputs.avgAge / 7));
        const hardwareExtensionSavings = pcsToReplace * COSTS.pcReplacement;
        const maintenanceSavingsPerYear = pcs * COSTS.maintenancePerPCPerYear * COSTS.maintenanceReductionLinux;
        const maintenanceSavings = maintenanceSavingsPerYear * years;
        const reconditioningCost = pcs * COSTS.pcReconditioning;
        const totalHardwareSavings = hardwareExtensionSavings + maintenanceSavings - reconditioningCost;

        const energySavingsPerYear = pcs * COSTS.energyPerPCPerYear * COSTS.energyReductionLinux;
        const energySavings = energySavingsPerYear * years;

        const nbTeachers = Math.ceil(pcs * COSTS.teacherRatio);
        const trainingCost = nbTeachers * COSTS.trainingPerTeacher;

        const co2Avoided = pcsToReplace * COSTS.co2PerPCPerYear * 5;
        const ewasteAvoided = pcsToReplace * COSTS.ewastePerPC;
        const treesEquivalent = Math.round(co2Avoided / 22);

        const totalSavings = totalLicenseSavings + totalHardwareSavings + energySavings;
        const totalCosts = trainingCost + reconditioningCost;
        const netSavings = totalSavings - totalCosts + reconditioningCost;
        const roiMonths = netSavings > 0 ? Math.ceil((totalCosts / (netSavings / years / 12))) : 0;

        return {
            windowsSavings, officeSavings, adobeSavings, antivirusSavings, totalLicenseSavings,
            hardwareExtensionSavings, maintenanceSavings, reconditioningCost, totalHardwareSavings,
            energySavings, trainingCost, co2Avoided, ewasteAvoided, treesEquivalent,
            totalSavings, totalCosts, netSavings, roiMonths, pcsToReplace,
        };
    }, [inputs]);

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
    };

    // Messages expressifs basés sur les résultats
    const getVerdict = () => {
        const savingsPerPC = results.netSavings / inputs.nbPCs / inputs.yearsProjection;
        if (savingsPerPC > 200) return { emoji: '🚀', text: 'Énorme potentiel !', desc: 'Votre établissement peut réaliser des économies exceptionnelles.' };
        if (savingsPerPC > 100) return { emoji: '🎯', text: 'Très intéressant !', desc: 'La transition vers NIRD est clairement avantageuse.' };
        if (savingsPerPC > 50) return { emoji: '👍', text: 'Rentable !', desc: 'Les économies compensent largement l\'investissement initial.' };
        return { emoji: '💡', text: 'À considérer', desc: 'Même modestes, les économies s\'accumulent et l\'impact écologique est réel.' };
    };

    const getComparisonText = () => {
        const monthly = results.netSavings / inputs.yearsProjection / 12;
        if (monthly > 5000) return `C'est l'équivalent d'un salaire complet économisé chaque mois !`;
        if (monthly > 2000) return `C'est comme embaucher un mi-temps payé par les économies !`;
        if (monthly > 500) return `C'est une sortie scolaire financée chaque mois !`;
        if (monthly > 100) return `C'est du matériel pédagogique supplémentaire chaque mois !`;
        return `Chaque euro compte pour votre budget !`;
    };

    // Thème clair/sombre
    const theme = isLightMode ? {
        bg: 'bg-white',
        bgSecondary: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        textMuted: 'text-gray-500',
        accent: 'text-emerald-600',
        accentBg: 'bg-emerald-500',
        card: 'bg-white border-gray-200',
    } : {
        bg: 'bg-[#0d0d0d]',
        bgSecondary: 'bg-[#1a1a1a]',
        border: 'border-[#2a2a2a]',
        text: 'text-white',
        textSecondary: 'text-gray-300',
        textMuted: 'text-gray-500',
        accent: 'text-[#00ff88]',
        accentBg: 'bg-[#00ff88]',
        card: 'bg-[#1a1a1a] border-[#2a2a2a]',
    };

    if (!isOpen) return null;

    const verdict = getVerdict();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className={`${theme.bg} w-[95vw] max-w-5xl h-[90vh] rounded-3xl border ${theme.border} shadow-2xl flex flex-col overflow-hidden transition-colors duration-300`}>
                {/* Header */}
                <div className={`${theme.bgSecondary} p-6 border-b ${theme.border} flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${theme.accentBg} flex items-center justify-center text-2xl shadow-lg`}>
                            🧮
                        </div>
                        <div>
                            <h2 className={`${theme.text} font-bold text-xl`}>Simulateur de Coûts NIRD</h2>
                            <p className={theme.textMuted}>Calculez vos économies potentielles</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setIsLightMode(!isLightMode)}
                            className={`p-3 rounded-xl border ${theme.border} ${theme.textSecondary} hover:${theme.accent} transition-all`}
                            title={isLightMode ? 'Mode sombre' : 'Mode clair'}
                        >
                            {isLightMode ? '🌙' : '☀️'}
                        </button>
                        <button
                            onClick={onClose}
                            className={`${theme.textMuted} hover:${theme.text} transition-colors p-2 hover:bg-black/10 rounded-lg`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 && (
                        <div className="space-y-8">
                            {/* Profil */}
                            <div>
                                <h3 className={`${theme.text} font-semibold mb-4 flex items-center gap-2`}>
                                    <span className={`w-8 h-8 rounded-lg ${isLightMode ? 'bg-emerald-100 text-emerald-600' : 'bg-[#00ff88]/20 text-[#00ff88]'} flex items-center justify-center text-sm font-bold`}>1</span>
                                    Votre profil
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {(Object.keys(PROFILE_LABELS) as Array<keyof typeof PROFILE_LABELS>).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => setInputs(prev => ({ ...prev, profile: key }))}
                                            className={`p-4 rounded-xl border transition-all ${inputs.profile === key
                                                    ? `${isLightMode ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]'}`
                                                    : `${theme.border} ${theme.textSecondary} hover:border-gray-400`
                                                }`}
                                        >
                                            {PROFILE_LABELS[key]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Parc informatique */}
                            <div>
                                <h3 className={`${theme.text} font-semibold mb-4 flex items-center gap-2`}>
                                    <span className={`w-8 h-8 rounded-lg ${isLightMode ? 'bg-emerald-100 text-emerald-600' : 'bg-[#00ff88]/20 text-[#00ff88]'} flex items-center justify-center text-sm font-bold`}>2</span>
                                    Votre parc informatique
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className={`${theme.textMuted} text-sm block mb-2`}>Nombre de PC</label>
                                        <input
                                            type="range" min="10" max="1000" step="10"
                                            value={inputs.nbPCs}
                                            onChange={(e) => setInputs(prev => ({ ...prev, nbPCs: Number(e.target.value) }))}
                                            className={`w-full ${isLightMode ? 'accent-emerald-500' : 'accent-[#00ff88]'}`}
                                        />
                                        <div className={`${theme.accent} text-2xl font-bold mt-2`}>{inputs.nbPCs} PC</div>
                                    </div>
                                    <div>
                                        <label className={`${theme.textMuted} text-sm block mb-2`}>Âge moyen du parc</label>
                                        <input
                                            type="range" min="1" max="15"
                                            value={inputs.avgAge}
                                            onChange={(e) => setInputs(prev => ({ ...prev, avgAge: Number(e.target.value) }))}
                                            className={`w-full ${isLightMode ? 'accent-emerald-500' : 'accent-[#00ff88]'}`}
                                        />
                                        <div className={`${theme.accent} text-2xl font-bold mt-2`}>{inputs.avgAge} ans</div>
                                    </div>
                                    <div>
                                        <label className={`${theme.textMuted} text-sm block mb-2`}>Projection sur</label>
                                        <input
                                            type="range" min="1" max="10"
                                            value={inputs.yearsProjection}
                                            onChange={(e) => setInputs(prev => ({ ...prev, yearsProjection: Number(e.target.value) }))}
                                            className={`w-full ${isLightMode ? 'accent-emerald-500' : 'accent-[#00ff88]'}`}
                                        />
                                        <div className={`${theme.accent} text-2xl font-bold mt-2`}>{inputs.yearsProjection} ans</div>
                                    </div>
                                </div>
                            </div>

                            {/* Licences */}
                            <div>
                                <h3 className={`${theme.text} font-semibold mb-4 flex items-center gap-2`}>
                                    <span className={`w-8 h-8 rounded-lg ${isLightMode ? 'bg-emerald-100 text-emerald-600' : 'bg-[#00ff88]/20 text-[#00ff88]'} flex items-center justify-center text-sm font-bold`}>3</span>
                                    Licences actuelles
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { key: 'hasWindows', label: '💻 Windows', cost: '145€/poste' },
                                        { key: 'hasOffice365', label: '📄 Office 365', cost: '70€/an' },
                                        { key: 'hasAdobe', label: '🎨 Adobe CC', cost: '600€/an' },
                                        { key: 'hasAntivirus', label: '🛡️ Antivirus', cost: '30€/an' },
                                    ].map((item) => (
                                        <button
                                            key={item.key}
                                            onClick={() => setInputs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof SimulatorInputs] }))}
                                            className={`p-4 rounded-xl border transition-all text-left ${inputs[item.key as keyof SimulatorInputs]
                                                    ? `${isLightMode ? 'border-emerald-500 bg-emerald-50' : 'border-[#00ff88] bg-[#00ff88]/10'}`
                                                    : `${theme.border} hover:border-gray-400`
                                                }`}
                                        >
                                            <div className={inputs[item.key as keyof SimulatorInputs] ? theme.accent : theme.textSecondary}>
                                                {item.label}
                                            </div>
                                            <div className={`${theme.textMuted} text-xs mt-1`}>{item.cost}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className={`w-full py-4 rounded-xl ${theme.accentBg} text-black font-bold text-lg hover:opacity-90 transition-all shadow-lg`}
                            >
                                Calculer mes économies →
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Verdict expressif */}
                            <div className={`${isLightMode ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200' : 'bg-gradient-to-br from-[#00ff88]/20 to-emerald-900/20 border-[#00ff88]/30'} rounded-2xl p-8 border text-center`}>
                                <div className="text-6xl mb-4">{verdict.emoji}</div>
                                <h3 className={`${theme.accent} text-3xl font-bold mb-2`}>{verdict.text}</h3>
                                <p className={`${theme.textSecondary} mb-4`}>{verdict.desc}</p>
                                <div className={`${theme.accent} text-5xl font-bold mb-2`}>{formatMoney(results.netSavings)}</div>
                                <p className={theme.textMuted}>d&apos;économies sur {inputs.yearsProjection} ans</p>
                            </div>

                            {/* Phrase d'accroche */}
                            <div className={`${theme.card} rounded-2xl p-6 border`}>
                                <p className={`${theme.text} text-xl text-center font-medium`}>
                                    💡 {getComparisonText()}
                                </p>
                            </div>

                            {/* Résumé rapide */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className={`${theme.card} rounded-xl p-4 border text-center`}>
                                    <div className="text-2xl mb-1">⏱️</div>
                                    <div className={`${theme.accent} text-2xl font-bold`}>{results.roiMonths}</div>
                                    <div className={`${theme.textMuted} text-sm`}>mois pour rentabiliser</div>
                                </div>
                                <div className={`${theme.card} rounded-xl p-4 border text-center`}>
                                    <div className="text-2xl mb-1">💻</div>
                                    <div className={`${theme.accent} text-2xl font-bold`}>{results.pcsToReplace}</div>
                                    <div className={`${theme.textMuted} text-sm`}>PC sauvés du remplacement</div>
                                </div>
                                <div className={`${theme.card} rounded-xl p-4 border text-center`}>
                                    <div className="text-2xl mb-1">🌳</div>
                                    <div className={`text-green-500 text-2xl font-bold`}>{results.treesEquivalent}</div>
                                    <div className={`${theme.textMuted} text-sm`}>arbres équivalents</div>
                                </div>
                                <div className={`${theme.card} rounded-xl p-4 border text-center`}>
                                    <div className="text-2xl mb-1">📦</div>
                                    <div className={`text-green-500 text-2xl font-bold`}>{results.ewasteAvoided} kg</div>
                                    <div className={`${theme.textMuted} text-sm`}>déchets évités</div>
                                </div>
                            </div>

                            {/* Détails par catégorie */}
                            <div className={`${theme.card} rounded-2xl p-6 border`}>
                                <h4 className={`${theme.text} font-semibold mb-4`}>📊 Détail des économies</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className={theme.textSecondary}>💻 Licences logicielles</span>
                                            <span className={theme.accent}>{formatMoney(results.totalLicenseSavings)}</span>
                                        </div>
                                        <div className={`h-2 ${isLightMode ? 'bg-gray-200' : 'bg-[#2a2a2a]'} rounded-full overflow-hidden`}>
                                            <div className={`h-full ${theme.accentBg} rounded-full`} style={{ width: `${Math.min(100, results.totalLicenseSavings / results.totalSavings * 100)}%` }} />
                                        </div>
                                        <p className={`${theme.textMuted} text-xs mt-1`}>Windows, Office, antivirus... remplacés par des alternatives libres</p>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className={theme.textSecondary}>🔧 Matériel prolongé</span>
                                            <span className="text-blue-500">{formatMoney(results.totalHardwareSavings)}</span>
                                        </div>
                                        <div className={`h-2 ${isLightMode ? 'bg-gray-200' : 'bg-[#2a2a2a]'} rounded-full overflow-hidden`}>
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, Math.max(0, results.totalHardwareSavings / results.totalSavings * 100))}%` }} />
                                        </div>
                                        <p className={`${theme.textMuted} text-xs mt-1`}>Linux fait revivre les vieux PC, moins de remplacements nécessaires</p>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className={theme.textSecondary}>⚡ Énergie économisée</span>
                                            <span className="text-yellow-500">{formatMoney(results.energySavings)}</span>
                                        </div>
                                        <div className={`h-2 ${isLightMode ? 'bg-gray-200' : 'bg-[#2a2a2a]'} rounded-full overflow-hidden`}>
                                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min(100, results.energySavings / results.totalSavings * 100)}%` }} />
                                        </div>
                                        <p className={`${theme.textMuted} text-xs mt-1`}>Linux consomme ~15% d&apos;énergie en moins</p>
                                    </div>
                                    <div className={`pt-4 border-t ${theme.border}`}>
                                        <div className="flex justify-between mb-1">
                                            <span className={theme.textSecondary}>👨‍🏫 Formation (investissement)</span>
                                            <span className="text-red-500">-{formatMoney(results.trainingCost)}</span>
                                        </div>
                                        <p className={`${theme.textMuted} text-xs mt-1`}>Formation de {Math.ceil(inputs.nbPCs * 0.1)} personnes • Un investissement vite rentabilisé</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message de conclusion */}
                            <div className={`${isLightMode ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-800/50'} rounded-2xl p-6 border`}>
                                <h4 className={`${theme.text} font-semibold mb-2`}>🎓 En résumé</h4>
                                <p className={theme.textSecondary}>
                                    En passant à NIRD, votre {PROFILE_LABELS[inputs.profile].toLowerCase()} avec <strong>{inputs.nbPCs} PC</strong> économiserait
                                    <strong className={theme.accent}> {formatMoney(results.netSavings / inputs.yearsProjection)}/an</strong>,
                                    soit <strong className={theme.accent}>{formatMoney(results.netSavings / inputs.yearsProjection / 12)}/mois</strong>.
                                    L&apos;investissement initial est rentabilisé en <strong>{results.roiMonths} mois</strong>.
                                    Bonus : vous évitez {results.co2Avoided} kg de CO₂ ! 🌱
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className={`flex-1 py-4 rounded-xl border ${theme.border} ${theme.textSecondary} font-semibold hover:border-gray-400 transition-all`}
                                >
                                    ← Modifier
                                </button>
                                <button
                                    onClick={onClose}
                                    className={`flex-1 py-4 rounded-xl ${theme.accentBg} text-black font-bold hover:opacity-90 transition-all`}
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
