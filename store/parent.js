export const state = () => ({
  childStatus: [],
  logsVer: 0,
});

export const mutations = {
  setChildStatus(state, v) {
    state.childStatus = v;
  },
  incLogsVer(state) {
    ++state.logsVer;
  },
};
