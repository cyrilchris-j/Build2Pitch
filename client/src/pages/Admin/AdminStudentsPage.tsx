import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { adminService } from '@/services/api';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Crown,
} from 'lucide-react';

interface StudentItem {
  id: string;
  name: string;
  email: string;
  role: string;
  registerNumber: string;
  mobileNumber: string;
  gender: string;
  section: string;
  teamId: string;
  teamName: string;
  isLeader: boolean;
}

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getStudents({ page, limit: 10, search });
      if (response.data?.data) {
        setStudents(response.data.data);
        if (response.data.meta) {
          setTotalPages(response.data.meta.totalPages || 1);
          setTotalRecords(response.data.meta.total || response.data.data.length);
        }
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  return (
    <PageContainer
      title="Student Directory"
      subtitle="Comprehensive registry of all registered student developers, designers, and team leads."
    >
      {/* Search Header */}
      <Card className="bg-[#111111] border-[#242424] p-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="Search Student Name, Reg No, Email, or Team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-[#070707] border border-[#242424] pl-9 pr-3 py-2 text-sm text-[#FFFFFF] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#E63946]"
            />
          </div>
          <Button type="submit" variant="primary" size="sm">
            Search Directory
          </Button>
        </form>
      </Card>

      {/* Dark Data Table */}
      <Card className="bg-[#111111] border-[#242424] p-0 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#FFFFFF]">
            <thead className="bg-[#070707] border-b border-[#242424] text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
              <tr>
                <th className="py-3.5 px-4">Register No</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Gender</th>
                <th className="py-3.5 px-4">Section</th>
                <th className="py-3.5 px-4">Team Name</th>
                <th className="py-3.5 px-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#8A8A8A]">
                    Loading student directory...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#8A8A8A]">
                    No student records found matching query.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-[#181818] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#E63946]">
                      {student.registerNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#FFFFFF]">
                      <div className="flex items-center gap-1.5">
                        {student.isLeader && <Crown className="h-3.5 w-3.5 text-[#E63946]" />}
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#8A8A8A]">
                      {student.email}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-[#8A8A8A]">
                      {student.mobileNumber}
                    </td>
                    <td className="py-3.5 px-4 text-[#8A8A8A]">
                      {student.gender}
                    </td>
                    <td className="py-3.5 px-4 text-[#8A8A8A]">
                      {student.section}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#FFFFFF]">
                      {student.teamName}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={student.isLeader ? 'accent' : 'muted'}>
                        {student.isLeader ? 'TEAM LEAD' : student.role}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-[#8A8A8A]">
          Page <span className="font-bold text-[#FFFFFF]">{page}</span> of{' '}
          <span className="font-bold text-[#FFFFFF]">{totalPages}</span> ({totalRecords} Total Students)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminStudentsPage;
