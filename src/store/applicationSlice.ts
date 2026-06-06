import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  id: string;
  userId: string;
  universityId: string;
  universityName: string;
  majorId: string;
  majorName: string;
  subjectGroup: string;
  fullName: string;
  dob: string;
  idCard: string;
  phone: string;
  email: string;
  scores: { subject: string; score: number }[];
  priorityGroup: string;
  priorityArea: string;
  files: { name: string; url: string; type: string }[];
  status: AppStatus;
  submittedAt: string;
  note?: string;
}

interface ApplicationState {
  applications: Application[];
}

const stored = localStorage.getItem('applications');
const initialState: ApplicationState = {
  applications: stored ? JSON.parse(stored) : [],
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    addApplication(state, action: PayloadAction<Application>) {
      state.applications.push(action.payload);
      localStorage.setItem('applications', JSON.stringify(state.applications));
    },
    updateStatus(
      state,
      action: PayloadAction<{ id: string; status: AppStatus; note?: string }>
    ) {
      const app = state.applications.find((a) => a.id === action.payload.id);
      if (app) {
        app.status = action.payload.status;
        if (action.payload.note) app.note = action.payload.note;
        localStorage.setItem('applications', JSON.stringify(state.applications));
      }
    },
  },
});

export const { addApplication, updateStatus } = applicationSlice.actions;
export default applicationSlice.reducer;