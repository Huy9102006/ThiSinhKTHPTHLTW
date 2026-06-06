export interface University {
  id: string;
  name: string;
  code: string;
  majors: Major[];
}

export interface Major {
  id: string;
  name: string;
  code: string;
  quota: number;
  subjectGroups: SubjectGroup[];
}

export interface SubjectGroup {
  id: string;
  code: string;
  subjects: string[];
}

const MOCK_UNIVERSITIES: University[] = [
  {
    id: 'u1',
    name: 'Đại học Bách Khoa Hà Nội',
    code: 'BKH',
    majors: [
      {
        id: 'm1',
        name: 'Công nghệ Thông tin',
        code: 'CNTT',
        quota: 200,
        subjectGroups: [
          { id: 'sg1', code: 'A00', subjects: ['Toán', 'Lý', 'Hóa'] },
          { id: 'sg2', code: 'A01', subjects: ['Toán', 'Lý', 'Anh'] },
        ],
      },
      {
        id: 'm2',
        name: 'Kỹ thuật Điện',
        code: 'KTD',
        quota: 150,
        subjectGroups: [
          { id: 'sg3', code: 'A00', subjects: ['Toán', 'Lý', 'Hóa'] },
        ],
      },
      {
        id: 'm3',
        name: 'Cơ khí',
        code: 'CK',
        quota: 100,
        subjectGroups: [
          { id: 'sg4', code: 'A00', subjects: ['Toán', 'Lý', 'Hóa'] },
          { id: 'sg5', code: 'D01', subjects: ['Toán', 'Văn', 'Anh'] },
        ],
      },
    ],
  },
  {
    id: 'u2',
    name: 'Đại học Kinh tế Quốc dân',
    code: 'NEU',
    majors: [
      {
        id: 'm4',
        name: 'Kinh tế',
        code: 'KT',
        quota: 300,
        subjectGroups: [
          { id: 'sg6', code: 'A00', subjects: ['Toán', 'Lý', 'Hóa'] },
          { id: 'sg7', code: 'D01', subjects: ['Toán', 'Văn', 'Anh'] },
        ],
      },
      {
        id: 'm5',
        name: 'Quản trị Kinh doanh',
        code: 'QTKD',
        quota: 250,
        subjectGroups: [
          { id: 'sg8', code: 'A00', subjects: ['Toán', 'Lý', 'Hóa'] },
          { id: 'sg9', code: 'C00', subjects: ['Văn', 'Sử', 'Địa'] },
        ],
      },
    ],
  },
  {
    id: 'u3',
    name: 'Học viện BCVT (PTIT)',
    code: 'PTIT',
    majors: [
      {
        id: 'm6',
        name: 'Công nghệ Thông tin',
        code: 'CNTT',
        quota: 180,
        subjectGroups: [
          { id: 'sg10', code: 'A00', subjects: ['Toán', 'Lý', 'Hóa'] },
          { id: 'sg11', code: 'A01', subjects: ['Toán', 'Lý', 'Anh'] },
        ],
      },
      {
        id: 'm7',
        name: 'Kỹ thuật Viễn thông',
        code: 'KTVT',
        quota: 120,
        subjectGroups: [
          { id: 'sg12', code: 'A00', subjects: ['Toán', 'Lý', 'Hóa'] },
        ],
      },
    ],
  },
];

const MOCK_USERS: { email: string; password: string; user: any }[] = [
  {
    email: 'test@gmail.com',
    password: '123456',
    user: {
      id: 'user1',
      email: 'test@gmail.com',
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      dob: '2006-01-15',
      idCard: '001206012345',
    },
  },
];

export const api = {
  async getUniversities(): Promise<University[]> {
    return new Promise((res) => setTimeout(() => res(MOCK_UNIVERSITIES), 300));
  },

  async getMajorsByUniversity(universityId: string): Promise<Major[]> {
    return new Promise((res) => {
      const uni = MOCK_UNIVERSITIES.find((u) => u.id === universityId);
      setTimeout(() => res(uni ? uni.majors : []), 200);
    });
  },

  async login(
    email: string,
    password: string
  ): Promise<{ user: any; token: string } | null> {
    return new Promise((res) => {
      const found = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );
      setTimeout(
        () => res(found ? { user: found.user, token: 'mock-token-' + found.user.id } : null),
        400
      );
    });
  },

  async register(data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    dob: string;
    idCard: string;
  }): Promise<{ user: any; token: string } | { error: string }> {
    return new Promise((res) => {
      const exists = MOCK_USERS.find((u) => u.email === data.email);
      if (exists) {
        setTimeout(() => res({ error: 'Email đã được sử dụng!' }), 300);
        return;
      }
      const newUser = {
        id: 'user_' + Date.now(),
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        dob: data.dob,
        idCard: data.idCard,
      };
      MOCK_USERS.push({ email: data.email, password: data.password, user: newUser });
      setTimeout(
        () => res({ user: newUser, token: 'mock-token-' + newUser.id }),
        400
      );
    });
  },
};

export { MOCK_UNIVERSITIES };