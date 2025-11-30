import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Maximize, Minimize, RotateCcw, Trash2, Send, ChevronRight, Check } from 'lucide-react';

const PromptTree = () => {
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [input, setInput] = useState('');
    const [nodeIdCounter, setNodeIdCounter] = useState(0);

    const containerRef = useRef(null);

    // Constants
    const VERTICAL_SPACING = 280;
    const HORIZONTAL_SPACING = 400;
    const START_X = 100;
    const START_Y = typeof window !== 'undefined' ? window.innerHeight / 2 - 100 : 300;

    // Handlers
    const handleMouseDown = (e) => {
        // Only drag if clicking on background
        if (e.target === containerRef.current || e.target.tagName === 'svg') {
            setIsDragging(true);
            setDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setViewport(prev => ({
                ...prev,
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            }));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        // e.preventDefault(); // React handles passive events differently, usually better not to preventDefault on wheel in passive listeners
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setViewport(prev => ({
            ...prev,
            zoom: Math.max(0.3, Math.min(2, prev.zoom + delta))
        }));
    };

    const addRootNode = (text) => {
        const newNode = {
            id: nodeIdCounter,
            text,
            depth: 0,
            x: START_X,
            y: START_Y,
            children: []
        };
        setNodes([newNode]);
        setNodeIdCounter(prev => prev + 1);
        panToNode(newNode);
        generateBranches(newNode);
    };

    const addChildNode = (parentId, text) => {
        // Find parent and calculate position
        // Note: In a real app with complex state, we might need a more robust tree traversal or flat map.
        // For this demo, we'll assume we can find the parent in the flat list if we maintain one, 
        // or we traverse. Let's maintain a flat list of nodes for rendering.

        const parent = nodes.find(n => n.id === parentId);
        if (!parent) return;

        const siblingCount = parent.children.length;
        const newNode = {
            id: nodeIdCounter,
            text,
            depth: parent.depth + 1,
            x: parent.x + HORIZONTAL_SPACING,
            y: parent.y + (siblingCount * VERTICAL_SPACING), // Simple stacking for now, rebalance later
            parentId: parent.id,
            children: []
        };

        // Update parent's children ref (immutably)
        const updatedNodes = nodes.map(n => {
            if (n.id === parentId) {
                return { ...n, children: [...n.children, newNode.id] };
            }
            return n;
        });

        setNodes([...updatedNodes, newNode]);
        setConnections(prev => [...prev, { from: parent, to: newNode }]);
        setNodeIdCounter(prev => prev + 1);

        // Rebalance siblings centered around parent
        // (Simplified for this step, can be improved)

        panToNode(newNode);
    };

    const generateBranches = async (parentNode) => {
        // Simulate AI generation for the 3 specific branches
        const branches = [
            { title: "Case Studies", desc: "Success Stories & Proven Results" },
            { title: "Financial Impact", desc: "ROI Analysis & Growth" },
            { title: "Strategic Vision", desc: "Market Positioning & Future" }
        ];

        let currentNodes = [...nodes];
        // We need to make sure we are working with the latest state if we await. 
        // For simplicity in this effect, we'll just add them sequentially.

        // We need to calculate Y offsets to center them
        const startY = parentNode.y - ((branches.length - 1) * VERTICAL_SPACING) / 2;

        const newNodes = [];
        const newConnections = [];
        let currentId = nodeIdCounter + 1; // +1 because we incremented for root already? No, let's use a local counter based on state

        // Wait, state updates are async. Let's build the whole tree update at once for smoothness.

        branches.forEach((branch, index) => {
            const node = {
                id: nodeIdCounter + 1 + index,
                text: branch.title,
                description: branch.desc,
                depth: parentNode.depth + 1,
                x: parentNode.x + HORIZONTAL_SPACING,
                y: startY + (index * VERTICAL_SPACING),
                parentId: parentNode.id,
                children: []
            };
            newNodes.push(node);
            newConnections.push({ from: parentNode, to: node });
        });

        // Update state once
        setNodes(prev => {
            // Update parent to have these children
            const parentIndex = prev.findIndex(n => n.id === parentNode.id);
            const updatedParent = { ...prev[parentIndex], children: newNodes.map(n => n.id) };
            const newPrev = [...prev];
            newPrev[parentIndex] = updatedParent;
            return [...newPrev, ...newNodes];
        });
        setConnections(prev => [...prev, ...newConnections]);
        setNodeIdCounter(prev => prev + branches.length);
    };

    const panToNode = (node) => {
        if (typeof window === 'undefined') return;
        const targetX = -node.x + window.innerWidth / 3;
        const targetY = -node.y + window.innerHeight / 2 - 60;

        // Animate viewport change? For now direct set
        setViewport(prev => ({ ...prev, x: targetX, y: targetY }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (nodes.length === 0) {
            addRootNode(input);
        } else if (selectedNodeId !== null) {
            addChildNode(selectedNodeId, input);
        }
        setInput('');
    };

    // Render Helpers
    // Render Helpers
    const renderConnection = (conn, i) => {
        const fromNode = nodes.find(n => n.id === conn.from.id) || conn.from;
        const toNode = nodes.find(n => n.id === conn.to.id) || conn.to;

        // Exact logic from user's snippet
        const NODE_WIDTH = 320; // Matches w-[320px] class
        const NODE_HEIGHT = 180; // Approximate height for centering (can be dynamic in future)

        const startX = fromNode.x + NODE_WIDTH;
        const startY = fromNode.y + (NODE_HEIGHT / 2);
        const endX = toNode.x;
        const endY = toNode.y + (NODE_HEIGHT / 2);

        // Midpoint X for the control points (Standard Cubic Bezier)
        const mx = startX + (endX - startX) / 2;

        // Path: Move to Start -> Curve to End using Midpoint X as control for both Ys
        const d = `M ${startX} ${startY} C ${mx} ${startY}, ${mx} ${endY}, ${endX} ${endY}`;

        return (
            <motion.path
                key={`conn-${conn.from.id}-${conn.to.id}`}
                d={d}
                className="connection-path"
                fill="none"
                stroke="url(#connectionGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        );
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0f] text-white font-sans selection:bg-indigo-500/30">
            {/* Backgrounds */}
            <div className="fixed inset-0 bg-gradient-overlay pointer-events-none z-0" />
            <div className="fixed inset-0 noise-overlay opacity-[0.03] pointer-events-none z-0" />
            <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

            {/* Instructions / Empty State */}
            {nodes.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="w-20 h-20 bg-[#12121a]/70 backdrop-blur-xl rounded-3xl border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 text-indigo-500 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]">
                            <Send className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl font-medium mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">Start with a prompt</h1>
                        <p className="text-slate-400 text-sm">Type below to generate your presentation tree</p>
                    </motion.div>
                </div>
            )}

            {/* Canvas */}
            <div
                ref={containerRef}
                className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <motion.div
                    className="absolute top-0 left-0 w-full h-full origin-top-left"
                    animate={{
                        x: viewport.x,
                        y: viewport.y,
                        scale: viewport.zoom
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }} // Smooth viewport transitions
                >
                    {/* Connections Layer */}
                    <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none">
                        <defs>
                            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                            </linearGradient>
                        </defs>
                        {connections.map((conn, i) => renderConnection(conn, i))}
                    </svg>

                    {/* Nodes Layer */}
                    {nodes.map((node) => (
                        <motion.div
                            key={node.id}
                            className={`absolute w-[320px] h-[180px] flex flex-col justify-center p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer group
                        ${selectedNodeId === node.id
                                    ? 'border-indigo-500 shadow-[0_0_60px_-10px_rgba(99,102,241,0.4)] bg-[#12121a]/90'
                                    : 'border-indigo-500/15 bg-[#12121a]/70 hover:border-indigo-500/50 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]'
                                }
                        ${node.depth === 0 ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border-indigo-500/30' : ''}
                    `}
                            style={{ left: node.x, top: node.y }}
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: node.depth > 0 ? 0.8 : 0, // Wait for connection animation (0.8s)
                                ease: "backOut"
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
                            }}
                        >
                            {/* Connection Dots */}
                            {node.depth > 0 && (
                                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#6366f1] shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10" />
                            )}
                            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#6366f1] shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10" />

                            {/* Header */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white
                            ${node.depth === 0 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
                                        node.depth === 1 ? 'bg-gradient-to-r from-purple-500 to-indigo-400' :
                                            'bg-gradient-to-r from-cyan-500 to-indigo-500'}
                        `}>
                                    {node.depth === 0 ? 'Topic' : node.depth === 1 ? 'Angle' : 'Slide'}
                                </span>
                                <span className="text-[11px] font-mono text-slate-500">Depth {node.depth}</span>
                            </div>

                            {/* Content */}
                            <div className="text-sm leading-relaxed text-slate-300">
                                <strong className="text-white block mb-1 text-base">{node.text}</strong>
                                {node.description && <span className="text-xs text-slate-400">{node.description}</span>}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4 pt-4 border-t border-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-indigo-500/20 transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> Expand
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-indigo-500/20 transition-colors">
                                    <Check className="w-3.5 h-3.5" /> Select
                                </button>
                            </div>

                            {/* Expand Indicator */}
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                +
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Controls */}
            <div className="fixed bottom-32 left-8 flex flex-col gap-2 z-20">
                <button onClick={() => setViewport(v => ({ ...v, zoom: Math.min(2, v.zoom + 0.1) }))} className="w-11 h-11 rounded-xl bg-[#12121a]/80 backdrop-blur-xl border border-indigo-500/20 text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/20 flex items-center justify-center transition-all">
                    <Maximize className="w-5 h-5" />
                </button>
                <button onClick={() => setViewport(v => ({ ...v, zoom: Math.max(0.3, v.zoom - 0.1) }))} className="w-11 h-11 rounded-xl bg-[#12121a]/80 backdrop-blur-xl border border-indigo-500/20 text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/20 flex items-center justify-center transition-all">
                    <Minimize className="w-5 h-5" />
                </button>
                <button onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })} className="w-11 h-11 rounded-xl bg-[#12121a]/80 backdrop-blur-xl border border-indigo-500/20 text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/20 flex items-center justify-center transition-all">
                    <RotateCcw className="w-5 h-5" />
                </button>
                <button onClick={() => { setNodes([]); setConnections([]); setNodeIdCounter(0); }} className="w-11 h-11 rounded-xl bg-[#12121a]/80 backdrop-blur-xl border border-indigo-500/20 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 flex items-center justify-center transition-all">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {/* Input Bar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] z-50">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                    <div className="relative flex items-center gap-3 p-1.5 rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-indigo-500/20 shadow-2xl">
                        <div className="pl-4 text-indigo-500">
                            <Send className="w-6 h-6" />
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter your prompt and press Enter..."
                                className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500 font-sans text-base py-3"
                                autoFocus
                            />
                        </form>
                        <button
                            onClick={handleSubmit}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PromptTree;
