import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StudentForm from '../components/StudentForm';
import type { StudentFormData } from '../schemas/student.schema';
import {
  createStudent,
  getStudent,
  updateStudent,
} from '../services/student.service';

export default function StudentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [student, setStudent] = useState<Awaited<ReturnType<typeof getStudent>> | null>(null);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!id) return;

    const studentId = Number(id);
    if (!Number.isInteger(studentId)) {
      setLoadError('Invalid student id');
      setIsLoading(false);
      return;
    }

    getStudent(studentId)
      .then(setStudent)
      .catch(() => setLoadError('Student not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (data: StudentFormData, photo?: File) => {
    if (isEdit && id) {
      const updated = await updateStudent(Number(id), data, photo);
      navigate(`/students/${updated.id}`);
      return;
    }

    const created = await createStudent(data, photo);
    navigate(`/students/${created.id}`);
  };

  return (
    <AppLayout>
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <Link to={isEdit && id ? `/students/${id}` : '/students'} className="text-sm text-blue-600 hover:underline">
            ← Back
          </Link>
          <h1 className="mt-2 text-xl font-semibold text-slate-900">
            {isEdit ? 'Edit Student' : 'Add Student'}
          </h1>
        </div>

        {isLoading && <p className="text-sm text-slate-500">Loading student...</p>}
        {loadError && <p className="text-sm text-red-600">{loadError}</p>}

        {!isLoading && !loadError && (!isEdit || student) && (
          <StudentForm
            initialData={student ?? undefined}
            onSubmit={handleSubmit}
            submitLabel={isEdit ? 'Save Changes' : 'Create Student'}
          />
        )}
      </div>
    </AppLayout>
  );
}
