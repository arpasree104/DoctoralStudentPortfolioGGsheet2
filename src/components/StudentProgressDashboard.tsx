import React, { useState, useEffect } from 'react';
import { User, StudentPortfolioData } from '../types';
import { getStudentPortfolio } from '../lib/googleSheets';
import { Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface StudentProgressDashboardProps {
  students: User[];
}

export default function StudentProgressDashboard({ students }: StudentProgressDashboardProps) {
  const [portfolios, setPortfolios] = useState<{ [key: string]: StudentPortfolioData | null }>({});
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const [idFilter, setIdFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const results: { [key: string]: StudentPortfolioData | null } = {};
      await Promise.all(students.map(async (stud) => {
        if (stud.StudentID) {
          const port = await getStudentPortfolio(stud.StudentID);
          results[stud.StudentID] = port;
        }
      }));
      setPortfolios(results);
      setLoading(false);
    };
    if (students.length > 0) {
      fetchAll();
    } else {
      setLoading(false);
    }
  }, [students]);

  const filteredStudents = students.filter(s => {
    if (nameFilter && !s.FullName.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (idFilter && !(s.StudentID || '').toLowerCase().includes(idFilter.toLowerCase())) return false;
    if (yearFilter && !(s.YearOfAdmission || '').toLowerCase().includes(yearFilter.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading student data...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Clock className="text-tu-red" />
        Student Progress Dashboard
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Filter by Name</label>
          <input
            type="text"
            placeholder="Search name..."
            value={nameFilter}
            onChange={e => setNameFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Filter by Student ID</label>
          <input
            type="text"
            placeholder="Search ID..."
            value={idFilter}
            onChange={e => setIdFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Filter by Year</label>
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">All Years</option>
            {[...new Set(students.map(s => s.YearOfAdmission).filter(Boolean))].sort().map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200 text-xs text-gray-500">
              <th className="py-3 px-4 font-bold">Student</th>
              <th className="py-3 px-4 font-bold">Latest Activity / Milestone</th>
              <th className="py-3 px-4 font-bold">Progress</th>
              <th className="py-3 px-4 font-bold">Obstacles</th>
              <th className="py-3 px-4 font-bold">Target Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? filteredStudents.map(stud => {
              const port = stud.StudentID ? portfolios[stud.StudentID] : null;
              const progressList = port?.dissertationProgress || [];
              const latestProgress = progressList.length > 0 ? progressList[progressList.length - 1] : null;

              return (
                <tr key={stud.UserID} className="hover:bg-red-50/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-800 text-sm">{stud.FullName}</div>
                    <div className="text-xs text-gray-500">{stud.StudentID} • Year {stud.YearOfAdmission || '-'}</div>
                  </td>
                  <td className="py-3 px-4">
                    {latestProgress ? (
                      <span className="text-sm font-medium text-gray-700">{latestProgress.activity}</span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">No progress recorded</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {latestProgress && latestProgress.progress && (
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                        ${latestProgress.progress === 'Completed' ? 'bg-green-100 text-green-700' :
                          latestProgress.progress === 'In progress' ? 'bg-blue-100 text-blue-700' :
                          latestProgress.progress === 'Postponed' ? 'bg-orange-100 text-orange-700' :
                          latestProgress.progress === 'Not started' ? 'bg-gray-100 text-gray-700' :
                          'bg-gray-100 text-gray-700'}`}
                      >
                        {latestProgress.progress}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {latestProgress?.obstacles ? (
                      <div className="flex items-start gap-1 text-xs text-red-600 max-w-[150px]">
                        <AlertCircle size={12} className="mt-0.5 shrink-0" />
                        <span className="truncate" title={latestProgress.obstacles}>{latestProgress.obstacles}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-gray-500">
                    {latestProgress?.date || '-'}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">No students match the filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
