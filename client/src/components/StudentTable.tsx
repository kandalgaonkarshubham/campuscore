import { Link } from 'react-router-dom';
import { resolveUploadUrl } from '../lib/urls';
import type { Student } from '../schemas/student.schema';

interface StudentTableProps {
  students: Student[];
}

function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export default function StudentTable({ students }: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 py-12 text-center">
        <p className="text-sm text-slate-500">No students found.</p>
        <Link to="/students/new" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
          Add your first student
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Photo</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Admission No.</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Course</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Year</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Gender</th>
            <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                {student.photoUrl ? (
                  <img
                    src={resolveUploadUrl(student.photoUrl) ?? undefined}
                    alt={student.name}
                    className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
              <td className="px-4 py-3 text-slate-600">{student.admissionNumber}</td>
              <td className="px-4 py-3 text-slate-600">{student.course}</td>
              <td className="px-4 py-3 text-slate-600">{student.year}</td>
              <td className="px-4 py-3 text-slate-600">{formatGender(student.gender)}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/students/${student.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
