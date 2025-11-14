"use client";

/**
 * School Settings Page
 * Manage school, invite teachers, manage team (Premium feature)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TeacherNav from '@/components/TeacherNav';
import TeacherFooter from '@/components/TeacherFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface School {
  school_id: string;
  school_name: string;
  package: string;
  role: string;
  teacher_count: number;
}

interface Teacher {
  id: string;
  teacher_id: string;
  role: string;
  joined_at: string;
  invited_by?: string;
}

export default function SchoolPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentRole, setCurrentRole] = useState<string>('teacher');
  const [loading, setLoading] = useState(true);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newTeacherId, setNewTeacherId] = useState('');
  const [inviteRole, setInviteRole] = useState('teacher');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools');
      const data = await response.json();

      if (data.success) {
        setSchools(data.schools);
        if (data.schools.length > 0) {
          selectSchool(data.schools[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectSchool = async (school: School) => {
    setSelectedSchool(school);
    setLoading(true);

    try {
      const response = await fetch(`/api/schools/${school.school_id}/teachers`);
      const data = await response.json();

      if (data.success) {
        setTeachers(data.teachers);
        setCurrentRole(data.currentRole);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSchool = async () => {
    if (!newSchoolName.trim()) {
      alert('Anna koulun nimi');
      return;
    }

    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSchoolName,
          package: 'yläaste'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Koulu luotu!');
        setNewSchoolName('');
        fetchSchools();
      } else {
        alert(`Virhe: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating school:', error);
      alert('Koulun luominen epäonnistui');
    }
  };

  const inviteTeacher = async () => {
    if (!selectedSchool) return;
    if (!newTeacherId.trim()) {
      alert('Anna opettajan tunnus');
      return;
    }

    try {
      const response = await fetch(`/api/schools/${selectedSchool.school_id}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newTeacherId,
          role: inviteRole
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Opettaja lisätty!');
        setNewTeacherId('');
        selectSchool(selectedSchool); // Refresh
      } else {
        alert(`Virhe: ${data.error}`);
      }
    } catch (error) {
      console.error('Error inviting teacher:', error);
      alert('Opettajan lisääminen epäonnistui');
    }
  };

  const removeTeacher = async (teacherId: string) => {
    if (!selectedSchool) return;
    if (!confirm('Haluatko varmasti poistaa tämän opettajan?')) return;

    try {
      const response = await fetch(
        `/api/schools/${selectedSchool.school_id}/teachers?teacherId=${teacherId}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (data.success) {
        alert('Opettaja poistettu');
        selectSchool(selectedSchool); // Refresh
      } else {
        alert(`Virhe: ${data.error}`);
      }
    } catch (error) {
      console.error('Error removing teacher:', error);
      alert('Opettajan poistaminen epäonnistui');
    }
  };

  if (loading && schools.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
        <TeacherNav />
        <div className="flex-1 max-w-6xl mx-auto p-8 w-full">
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
        <TeacherFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <TeacherNav />
      <div className="flex-1 max-w-6xl mx-auto p-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Koulun hallinta</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Schools List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Omat koulut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {schools.map((school) => (
                <button
                  key={school.school_id}
                  onClick={() => selectSchool(school)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedSchool?.school_id === school.school_id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-semibold">{school.school_name}</div>
                  <div className="text-sm text-gray-600">
                    {school.package} • {school.teacher_count} opettajaa
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Rooli: {school.role}
                  </div>
                </button>
              ))}

              <div className="pt-4 border-t">
                <input
                  type="text"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  placeholder="Koulun nimi"
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <Button onClick={createSchool} className="w-full">
                  Luo uusi koulu
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* School Details & Team Management */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedSchool ? selectedSchool.school_name : 'Valitse koulu'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedSchool ? (
                <p className="text-gray-600">Valitse koulu vasemmalta</p>
              ) : (
                <div className="space-y-6">
                  {/* School Info */}
                  <div>
                    <h3 className="font-semibold mb-2">Koulun tiedot</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div>
                        <span className="font-medium">Paketti:</span>{' '}
                        <span className="capitalize">{selectedSchool.package}</span>
                        {selectedSchool.package === 'premium' && (
                          <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                            PREMIUM
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Opettajat:</span>{' '}
                        {teachers.length} / {selectedSchool.package === 'premium' ? 5 : 1}
                      </div>
                      <div>
                        <span className="font-medium">Sinun rooli:</span> {currentRole}
                      </div>
                    </div>
                  </div>

                  {/* Team Management */}
                  <div>
                    <h3 className="font-semibold mb-2">Opettajat</h3>
                    <div className="space-y-2">
                      {teachers.map((teacher) => (
                        <div
                          key={teacher.id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{teacher.teacher_id}</div>
                            <div className="text-sm text-gray-600">
                              {teacher.role} • Liittyi{' '}
                              {new Date(teacher.joined_at).toLocaleDateString('fi-FI')}
                            </div>
                          </div>
                          {currentRole === 'admin' && teacher.role !== 'admin' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTeacher(teacher.teacher_id)}
                            >
                              Poista
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Invite Teacher (Admin only) */}
                  {currentRole === 'admin' && selectedSchool.package === 'premium' && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Kutsu uusi opettaja</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newTeacherId}
                          onChange={(e) => setNewTeacherId(e.target.value)}
                          placeholder="Opettajan tunnus"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                        <select
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="teacher">Opettaja</option>
                          <option value="admin">Admin</option>
                          <option value="viewer">Katselija</option>
                        </select>
                        <Button onClick={inviteTeacher} className="w-full">
                          Lähetä kutsu
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentRole === 'admin' && selectedSchool.package !== 'premium' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Päivitä Premium-pakettiin
                      </h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Premium-paketilla voit lisätä jopa 5 opettajaa yhteistyöhön.
                      </p>
                      <Button
                        onClick={() => router.push('/kouluille')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Tutustu Premium-pakettiin
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <TeacherFooter />
    </div>
  );
}
