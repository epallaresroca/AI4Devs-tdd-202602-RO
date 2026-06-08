type MockRequest = {
    body: unknown;
};

type MockResponse = {
    status: jest.MockedFunction<(code: number) => MockResponse>;
    json: jest.MockedFunction<(body: unknown) => MockResponse>;
};

const createMockResponse = (): MockResponse => {
    const response = {} as MockResponse;
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
};

describe('Insercion de candidatos', () => {
    const validCandidateData = {
        firstName: 'Ana',
        lastName: 'Garcia',
        email: 'ana.garcia@example.com',
        phone: '612345678',
        address: 'Calle Mayor 1',
        educations: [
            {
                institution: 'Universidad Complutense',
                title: 'Ingenieria Informatica',
                startDate: '2020-09-01',
                endDate: '2024-06-30',
            },
        ],
        workExperiences: [
            {
                company: 'LTI',
                position: 'Backend Developer',
                description: 'Desarrollo de APIs',
                startDate: '2024-07-01',
                endDate: '2025-12-31',
            },
        ],
        cv: {
            filePath: '/uploads/ana-garcia.pdf',
            fileType: 'application/pdf',
        },
    };

    describe('Recepcion de datos del formulario', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.clearAllMocks();
        });

        afterEach(() => {
            jest.dontMock('../application/services/candidateService');
        });

        test('debe recibir los datos del formulario y delegar la insercion en el servicio', async () => {
            // Arrange
            const savedCandidate = { id: 1, ...validCandidateData };
            const addCandidateMock = jest.fn().mockResolvedValue(savedCandidate);

            jest.doMock('../application/services/candidateService', () => ({
                addCandidate: addCandidateMock,
            }));

            const { addCandidateController } = await import('../presentation/controllers/candidateController');
            const req: MockRequest = { body: validCandidateData };
            const res = createMockResponse();

            // Act
            await addCandidateController(req as any, res as any);

            // Assert
            expect(addCandidateMock).toHaveBeenCalledTimes(1);
            expect(addCandidateMock).toHaveBeenCalledWith(validCandidateData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Candidate added successfully',
                data: savedCandidate,
            });
        });

        test('debe responder con error 400 cuando los datos del formulario no son validos', async () => {
            // Arrange
            const invalidCandidateData = {
                ...validCandidateData,
                email: 'email-no-valido',
            };
            const addCandidateMock = jest.fn().mockRejectedValue(new Error('Invalid email'));

            jest.doMock('../application/services/candidateService', () => ({
                addCandidate: addCandidateMock,
            }));

            const { addCandidateController } = await import('../presentation/controllers/candidateController');
            const req: MockRequest = { body: invalidCandidateData };
            const res = createMockResponse();

            // Act
            await addCandidateController(req as any, res as any);

            // Assert
            expect(addCandidateMock).toHaveBeenCalledWith(invalidCandidateData);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'Invalid email',
            });
        });
    });

    describe('Guardado en base de datos', () => {
        const candidateSaveMock = jest.fn();
        const educationSaveMock = jest.fn();
        const workExperienceSaveMock = jest.fn();
        const resumeSaveMock = jest.fn();
        const CandidateMock = jest.fn();
        const EducationMock = jest.fn();
        const WorkExperienceMock = jest.fn();
        const ResumeMock = jest.fn();

        beforeEach(() => {
            jest.resetModules();
            jest.clearAllMocks();
            jest.dontMock('../application/services/candidateService');

            candidateSaveMock.mockReset();
            educationSaveMock.mockReset();
            workExperienceSaveMock.mockReset();
            resumeSaveMock.mockReset();
            CandidateMock.mockReset();
            EducationMock.mockReset();
            WorkExperienceMock.mockReset();
            ResumeMock.mockReset();

            jest.doMock('../domain/models/Candidate', () => ({
                Candidate: CandidateMock.mockImplementation((data: any) => ({
                    ...data,
                    education: data.education || [],
                    workExperience: data.workExperience || [],
                    resumes: data.resumes || [],
                    save: candidateSaveMock,
                })),
            }));

            jest.doMock('../domain/models/Education', () => ({
                Education: EducationMock.mockImplementation((data: any) => ({
                    ...data,
                    save: educationSaveMock,
                })),
            }));

            jest.doMock('../domain/models/WorkExperience', () => ({
                WorkExperience: WorkExperienceMock.mockImplementation((data: any) => ({
                    ...data,
                    save: workExperienceSaveMock,
                })),
            }));

            jest.doMock('../domain/models/Resume', () => ({
                Resume: ResumeMock.mockImplementation((data: any) => ({
                    ...data,
                    save: resumeSaveMock,
                })),
            }));
        });

        test('debe crear y guardar un candidato valido usando el modelo de persistencia', async () => {
            // Arrange
            const savedCandidate = {
                id: 10,
                firstName: validCandidateData.firstName,
                lastName: validCandidateData.lastName,
                email: validCandidateData.email,
                phone: validCandidateData.phone,
                address: validCandidateData.address,
            };
            candidateSaveMock.mockResolvedValue(savedCandidate);
            educationSaveMock.mockResolvedValue({ id: 20 });
            workExperienceSaveMock.mockResolvedValue({ id: 30 });
            resumeSaveMock.mockResolvedValue({ id: 40 });

            const { addCandidate } = await import('../application/services/candidateService');

            // Act
            const result = await addCandidate(validCandidateData);

            // Assert
            expect(CandidateMock).toHaveBeenCalledTimes(1);
            expect(CandidateMock).toHaveBeenCalledWith(validCandidateData);
            expect(candidateSaveMock).toHaveBeenCalledTimes(1);
            expect(EducationMock).toHaveBeenCalledWith(validCandidateData.educations[0]);
            expect(educationSaveMock).toHaveBeenCalledTimes(1);
            expect(WorkExperienceMock).toHaveBeenCalledWith(validCandidateData.workExperiences[0]);
            expect(workExperienceSaveMock).toHaveBeenCalledTimes(1);
            expect(ResumeMock).toHaveBeenCalledWith(validCandidateData.cv);
            expect(resumeSaveMock).toHaveBeenCalledTimes(1);
            expect(result).toEqual(savedCandidate);
        });

        test('debe enviar a persistencia solo los campos del schema de candidato cuando no hay relaciones', async () => {
            // Arrange
            const candidateDataWithoutRelations = {
                firstName: 'Luis',
                lastName: 'Perez',
                email: 'luis.perez@example.com',
                phone: '712345678',
                address: 'Avenida Central 2',
            };
            const savedCandidate = { id: 11, ...candidateDataWithoutRelations };
            candidateSaveMock.mockResolvedValue(savedCandidate);

            const { addCandidate } = await import('../application/services/candidateService');

            // Act
            const result = await addCandidate(candidateDataWithoutRelations);

            // Assert
            expect(CandidateMock).toHaveBeenCalledWith(candidateDataWithoutRelations);
            expect(candidateSaveMock).toHaveBeenCalledTimes(1);
            expect(EducationMock).not.toHaveBeenCalled();
            expect(WorkExperienceMock).not.toHaveBeenCalled();
            expect(ResumeMock).not.toHaveBeenCalled();
            expect(result).toEqual(savedCandidate);
        });

        test('debe rechazar datos invalidos antes de intentar guardar en base de datos', async () => {
            // Arrange
            const invalidCandidateData = {
                ...validCandidateData,
                firstName: 'A',
            };

            const { addCandidate } = await import('../application/services/candidateService');

            // Act
            const result = addCandidate(invalidCandidateData);

            // Assert
            await expect(result).rejects.toThrow('Invalid name');
            expect(CandidateMock).not.toHaveBeenCalled();
            expect(candidateSaveMock).not.toHaveBeenCalled();
        });

        test('debe devolver un error controlado cuando Prisma informa de email duplicado', async () => {
            // Arrange
            candidateSaveMock.mockRejectedValue({ code: 'P2002' });

            const { addCandidate } = await import('../application/services/candidateService');

            // Act
            const result = addCandidate(validCandidateData);

            // Assert
            await expect(result).rejects.toThrow('The email already exists in the database');
            expect(candidateSaveMock).toHaveBeenCalledTimes(1);
            expect(educationSaveMock).not.toHaveBeenCalled();
            expect(workExperienceSaveMock).not.toHaveBeenCalled();
            expect(resumeSaveMock).not.toHaveBeenCalled();
        });
    });
});
