className = "w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 px-6 py-4 text-xl font-light"
autoFocus
    />
    <button
        type="submit"
        disabled={!input.trim()}
        className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
    >
        <Send className="w-6 h-6" />
    </button>
                    </div >
                </div >
            </motion.form >
        </div >
    );
};

export default ChatInterface;
