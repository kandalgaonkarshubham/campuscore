import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import AppLayout from '../components/AppLayout';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { getErrorMessage } from '../lib/errors';
import { resolveUploadUrl } from '../lib/urls';
import type { Student } from '../validators/student';
import { deleteStudent, getStudent } from '../api/students';

function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const studentId = Number(id);
    if (!Number.isInteger(studentId)) {
      setError('Invalid student id');
      setIsLoading(false);
      return;
    }

    getStudent(studentId)
      .then(setStudent)
      .catch(() => setError('Student not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!student) return;

    setIsDeleting(true);
    try {
      await deleteStudent(student.id);
      toast.success('Student deleted');
      navigate('/students', { replace: true });
    } catch (error) {
      setError(getErrorMessage(error, 'Failed to delete student'));
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <AppLayout>
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link to="/students" className="text-sm text-blue-600 hover:underline">
          ← Back to students
        </Link>

        {isLoading && <LoadingSpinner className="mt-8 py-8" />}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {student && (
          <>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {student.photoUrl && (
                  <img
                    src={resolveUploadUrl(student.photoUrl) ?? undefined}
                    alt={student.name}
                    className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">{student.name}</h1>
                  <p className="mt-1 text-sm text-slate-500">{student.admissionNumber}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/students/${student.id}/edit`}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setShowDeleteDialog(true)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <DetailItem label="Course" value={student.course} />
              <DetailItem label="Year" value={String(student.year)} />
              <DetailItem label="Date of Birth" value={student.dob} />
              <DetailItem label="Gender" value={formatGender(student.gender)} />
              <DetailItem label="Email" value={student.email} />
              <DetailItem label="Mobile" value={student.mobile} />
              <DetailItem label="Address" value={student.address} className="sm:col-span-2" />
              <DetailItem
                label="Last Updated"
                value={new Date(student.updatedAt).toLocaleString()}
                className="sm:col-span-2"
              />
            </dl>
          </>
        )}
      </div>

      {showDeleteDialog && student && (
        <DeleteConfirmDialog
          studentName={student.name}
          isDeleting={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </AppLayout>
  );
}

function DetailItem({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{value}</dd>
    </div>
  );
}
