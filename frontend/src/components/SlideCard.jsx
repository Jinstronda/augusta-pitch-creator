import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

const SlideCard = ({ title, description, type, onSelect }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card-premium rounded-2xl p-8 h-full flex flex-col relative group cursor-pointer overflow-hidden"
            onClick={onSelect}
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase
            ${type === 'Case Studies' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            type === 'PnL' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                'bg-purple-500/20 text-purple-300 border border-purple-500/30'}`}>
                        {type}
                    </span>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        className="text-white/50"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </motion.div>
                </div>

                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">{description}</p>

                <div className="flex items-center gap-3 text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        <Check className="w-4 h-4" />
                    </div>
                    <span>Select this angle</span>
                </div>
            </div>
        </motion.div>
    );
};

export default SlideCard;
