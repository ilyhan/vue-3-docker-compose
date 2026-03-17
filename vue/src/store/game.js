
const MUTATIONS = {
    ADD_RECORD: 'ADD_RECORD',
    SET_DIFFICULTY: 'SET_DIFFICULTY',
}

export default {
    namespaced: true,
    state() {
        return {
            count: 0,
            difficulty: 'normal',
            records: [],
        }
    },
    getters: {
        getRecords: (state) => (difficulty = 'normal') => {
            return state.records
                .filter((rec) => rec.difficulty === difficulty)
                .sort((a, b) => a.time - b.time)
        },
        getDifficulty: (state) => state.difficulty
    },
    mutations: {
        [MUTATIONS.ADD_RECORD]: (state, payload) => {
            const tempRecords = [...state.records, payload];

            const normalRecords = tempRecords
                .filter(r => r.difficulty === 'normal')
                .sort((a, b) => a.time - b.time);
            const hardRecords = tempRecords
                .filter(r => r.difficulty === 'hard')
                .sort((a, b) => a.time - b.time);

            const topNormal = normalRecords.slice(0, 10);
            const topHard = hardRecords.slice(0, 10);

            state.records = [...topNormal, ...topHard];
        },
        [MUTATIONS.SET_DIFFICULTY]: (state, value) => state.difficulty = value
    },
    actions: {
        addRecord: (store, time) => {
            store.commit(MUTATIONS.ADD_RECORD, { time, difficulty: store.state.difficulty })
        },
        setDifficulty: (store, value) => {
            store.commit(MUTATIONS.SET_DIFFICULTY, value)
        }
    },
}
