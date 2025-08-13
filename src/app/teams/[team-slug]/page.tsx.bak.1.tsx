"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAtom } from "jotai";
import { Users, UserPlus, ExternalLink, Mail, Building2 } from "lucide-react";
import { APP_NAME } from "@/utils/constants";
import Header from "@/components/common/Header";
import {
  teamDataAtom,
  teamLoadingAtom,
  teamErrorAtom,
  setWorkingAtom,
} from "@/atoms/globalAtoms";
import { loadTeamMembersFromStorage } from "@/utils/teamLoader";
import { TeamMember } from "@/types/types";

// Force static generation
export const dynamic = "force-static";

export default function Team() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useAtom(teamDataAtom);
  const [loading, setLoading] = useAtom(teamLoadingAtom);
  const [error, setError] = useAtom(teamErrorAtom);
  const [, setWorking] = useAtom(setWorkingAtom);

  // Set page title and ensure team members are loaded
  useEffect(() => {
    document.title = `Team - ${APP_NAME}`;

    // Load team members if not already loaded and not loading
    if (teamMembers.length === 0 && !loading) {
      loadTeam();
    }
  }, [teamMembers.length, loading]);

  const loadTeam = async () => {
    setLoading(true);
    setError(null);
    setWorking({ isWorking: true, message: "Loading team members" });

    try {
      const loadedMembers = await loadTeamMembersFromStorage();
      setTeamMembers(loadedMembers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load team members";
      setError(errorMessage);
    }

    setLoading(false);
    setWorking({ isWorking: false, message: "" });
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div id="team-page" className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          onBackToHome={handleBackToHome}
          pageTitle="Team"
          currentRoute="/team"
        />

        <div className="flex-1 flex items-center justify-center p-4">
          <div id="loading-indicator" className="text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg border">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading team members.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="team-page" className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          onBackToHome={handleBackToHome}
          pageTitle="Team"
          currentRoute="/team"
        />

        <div className="flex-1 flex items-center justify-center p-4">
          <div id="error-indicator" className="text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg border max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Failed to load team
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                id="retry-team-button"
                onClick={loadTeam}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="team-page" className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onBackToHome={handleBackToHome}
        pageTitle="Team"
        currentRoute="/team"
      />

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div id="team-summary" className="mb-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Team Management
              </h2>
              <p className="text-gray-600 mb-4">
                Manage your team members and their training assignments.
              </p>
              <div className="text-sm text-gray-500">
                <span id="team-count">
                  {teamMembers.length} team members.
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Team Members
            </h3>
            <Link
              href="/team/add"
              id="add-member-button"
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </Link>
          </div>

          <div
            id="team-grid"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {teamMembers.map((member: TeamMember) => (
              <div
                key={member.id}
                id={`member-card-${member.id}`}
                className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-200"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>

                  {member.role && (
                    <p className="text-gray-600 mb-2 text-sm font-medium">
                      {member.role}
                    </p>
                  )}

                  {member.department && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span>{member.department}</span>
                    </div>
                  )}

                  {member.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Link
                    href={`/team/${member.id}`}
                    id={`view-member-${member.id}`}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Details
                  </Link>
                  <Link
                    href={`/team/${member.id}/training`}
                    id={`view-training-${member.id}`}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Training Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {teamMembers.length === 0 && !loading && !error && (
            <div id="no-team-members" className="text-center py-12">
              <div className="bg-white rounded-lg p-12 shadow-sm border max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  No team members yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Add your first team member to get started with training management.
                </p>
                <Link
                  href="/team/add"
                  id="add-first-member-button"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 mx-auto w-fit"
                >
                  <UserPlus className="w-4 h-4" />
                  Add First Member
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}