import { create } from 'zustand';

const useUserStore = create((set) => ({
  isLoggedIn: false,
  isLoading: false,
  isLoadingMini: false,
  companies: [],
  projects: [],
  currentCompany:  '',
  currentProject:  '',
  profileKey: '',
  uid: '',
  name: '',
  email: '',
  roleCompany: '',
  roleProject: '',
  authFirebaseToken : '',
  users: [],
  accessToken: '',
  userType: 'user',
  expired:true,
  webConfig:{},


  setUid: (data) => {
    set({
      uid: data,
    });
  },

  setName: (data) => {
    set({
      name: data,
    });
  },

  setEmail: (data) => {
    set({
      email: data,
    });
  },

  setIsLoggedIn: (data) => {
    set({
      isLoggedIn: data,
    });
  },

  setIsLoading: (data) => {
    set({
      isLoading: data,
    });
  },
  
  setIsLoadingMini: (data) => {
    set({
      isLoadingMini: data,
    });
  },

  setCompanies: (data) => {
    set({
      companies: data,
    });
  },

  setCurrentCompany: (data) => {
    set({
      currentCompany: data,
    });
  },

  setProjects: (data) => {
    set({
      projects: data,
    });
  },

  setCurrentProject: (data) => {
    set({
      currentProject: data,
    });
  },

  setRoleCompany: (data) => {
    set({
      roleCompany: data,
    });
  },

  setRoleProject: (data) => {
    set({
      roleProject: data,
    });
  },


  setUsers: (data) => {
    set({
      users: data,
    });
  },
  setAccessToken: (data) => {
    set({
      accessToken: data,
    });
  },

  setAuthFirebaseToken: (data) => {
    set({
      authFirebaseToken:data,
    });
  },

  setExpired:(data) => {
    set({
      expired:data
    })
  },

  setUserType:(data) => {
    set({
      userType:data
    })
  },

  setWebConfig:(data) => {
    set({
      webConfig:data
    })
  },

}));

export default useUserStore;