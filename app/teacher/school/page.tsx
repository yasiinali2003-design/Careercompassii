"use client";

/**
 * School Settings Page
 * Manage school, invite teachers, manage team (Premium feature)
 * Updated with Dashly X inspired professional design
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Building2,
  Users,
  Crown,
  Plus,
  Trash2,
  UserPlus,
  Loader2,
  ChevronRight,
  Shield,
  Eye,
  Star
} from 'lucide-react';

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
  const [creatingSchool, setCreatingSchool] = useState(false);
  const [invitingTeacher, setInvitingTeacher] = useState(false);

  const fetchSchools = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

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

    setCreatingSchool(true);
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
    } finally {
      setCreatingSchool(false);
    }
  };

  const inviteTeacher = async () => {
    if (!selectedSchool) return;
    if (!newTeacherId.trim()) {
      alert('Anna opettajan tunnus');
      return;
    }

    setInvitingTeacher(true);
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
        selectSchool(selectedSchool);
      } else {
        alert(`Virhe: ${data.error}`);
      }
    } catch (error) {
      console.error('Error inviting teacher:', error);
      alert('Opettajan lisääminen epäonnistui');
    } finally {
      setInvitingTeacher(false);
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
        selectSchool(selectedSchool);
      } else {
        alert(`Virhe: ${data.error}`);
      }
    } catch (error) {
      console.error('Error removing teacher:', error);
      alert('Opettajan poistaminen epäonnistui');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-400" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-neutral-400" />;
      default:
        return <Users className="h-4 w-4 text-emerald-400" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
            Admin
          </span>
        );
      case 'viewer':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-neutral-500/10 text-neutral-400 rounded-full">
            Katselija
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full">
            Opettaja
          </span>
        );
    }
  };

  if (loading && schools.length === 0) {
    return (
      <DashboardLayout title="Koulun hallinta" subtitle="Ladataan...">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-neutral-400 text-sm">Ladataan koulun tietoja...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Koulun hallinta"
      subtitle="Hallitse kouluja ja opettajatiimejä"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Schools List */}
        <div className="lg:col-span-1">
          <div className="bg-[#0d1117] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-5 py-4 border-b border-white/[0.08]">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-400" />
                Omat koulut
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {schools.map((school) => (
                <button
                  key={school.school_id}
                  onClick={() => selectSchool(school)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedSchool?.school_id === school.school_id
                      ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-2 border-blue-500/30'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-white">{school.school_name}</div>
                      <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                        <span className="capitalize">{school.package}</span>
                        <span>•</span>
                        <span>{school.teacher_count} opettajaa</span>
                      </div>
                    </div>
                    {school.package === 'premium' && (
                      <Crown className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="mt-2">
                    {getRoleBadge(school.role)}
                  </div>
                  {selectedSchool?.school_id === school.school_id && (
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                  )}
                </button>
              ))}

              {/* Create new school */}
              <div className="pt-4 border-t border-white/[0.08]">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    placeholder="Koulun nimi"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  <button
                    onClick={createSchool}
                    disabled={creatingSchool}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-500/50 disabled:to-blue-600/50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:cursor-not-allowed"
                  >
                    {creatingSchool ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span>Luo uusi koulu</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* School Details & Team Management */}
        <div className="lg:col-span-2">
          <div className="bg-[#0d1117] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-4 border-b border-white/[0.08]">
              <h3 className="font-semibold text-white">
                {selectedSchool ? selectedSchool.school_name : 'Valitse koulu'}
              </h3>
              {selectedSchool && (
                <p className="text-sm text-neutral-400 mt-0.5">
                  Hallitse koulun asetuksia ja opettajia
                </p>
              )}
            </div>

            <div className="p-6">
              {!selectedSchool ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-400">Valitse koulu vasemmalta tai luo uusi</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* School Info */}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-300 mb-4">Koulun tiedot</h4>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">Paketti</p>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium capitalize">
                              {selectedSchool.package}
                            </span>
                            {selectedSchool.package === 'premium' && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/10 text-yellow-400 rounded-full flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                PREMIUM
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">Opettajat</p>
                          <p className="text-white font-medium">
                            {teachers.length} / {selectedSchool.package === 'premium' ? 5 : 1}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">Sinun rooli</p>
                          {getRoleBadge(currentRole)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Management */}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-300 mb-4">Opettajat</h4>
                    <div className="space-y-2">
                      {teachers.map((teacher) => (
                        <div
                          key={teacher.id}
                          className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                              {getRoleIcon(teacher.role)}
                            </div>
                            <div>
                              <p className="font-medium text-white">{teacher.teacher_id}</p>
                              <p className="text-xs text-neutral-500">
                                Liittyi {new Date(teacher.joined_at).toLocaleDateString('fi-FI')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getRoleBadge(teacher.role)}
                            {currentRole === 'admin' && teacher.role !== 'admin' && (
                              <button
                                onClick={() => removeTeacher(teacher.teacher_id)}
                                className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Invite Teacher (Admin only with Premium) */}
                  {currentRole === 'admin' && selectedSchool.package === 'premium' && (
                    <div className="border-t border-white/[0.08] pt-6">
                      <h4 className="text-sm font-medium text-neutral-300 mb-4 flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-blue-400" />
                        Kutsu uusi opettaja
                      </h4>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={newTeacherId}
                          onChange={(e) => setNewTeacherId(e.target.value)}
                          placeholder="Opettajan tunnus"
                          className="sm:col-span-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                        <select
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value)}
                          className="sm:col-span-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        >
                          <option value="teacher">Opettaja</option>
                          <option value="admin">Admin</option>
                          <option value="viewer">Katselija</option>
                        </select>
                        <button
                          onClick={inviteTeacher}
                          disabled={invitingTeacher}
                          className="sm:col-span-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-500/50 disabled:to-blue-600/50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:cursor-not-allowed"
                        >
                          {invitingTeacher ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4" />
                              <span>Lähetä kutsu</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Premium upsell */}
                  {currentRole === 'admin' && selectedSchool.package !== 'premium' && (
                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-5">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                          <Crown className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">
                            Päivitä Premium-pakettiin
                          </h4>
                          <p className="text-sm text-neutral-400 mb-4">
                            Premium-paketilla voit lisätä jopa 5 opettajaa yhteistyöhön, saada edistyneet analyysit ja paljon muuta.
                          </p>
                          <button
                            onClick={() => router.push('/kouluille')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                          >
                            <Star className="h-4 w-4" />
                            Tutustu Premium-pakettiin
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
