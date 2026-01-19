// services/progressService.ts
import { authService, fetchWithAuthRetry } from "../lib/auth"; // Adjust path as needed

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface UpdateProgressRequest {
  phaseIndex: number;
  totalPhases: number;
}

export interface LessonProgress {
  lessonKey: string;
  lastPhaseIndex: number;
  totalPhases: number;
  isCompleted: boolean;
  lastPlayed: string;
}

export interface ProgressResponse {
  success: boolean;
  message?: string;
  progress?: LessonProgress;
}

class ProgressService {
  async updateLessonProgress(
    lessonKey: string,
    data: UpdateProgressRequest
  ): Promise<ProgressResponse> {
    try {
      const response = await fetchWithAuthRetry(
        `${API_URL}/update-progress/${lessonKey}`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (!response) {
        return {
          success: false,
          message: "",
        };
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update progress");
      }

      return await response.json();
    } catch (error: any) {
      console.error("Error updating progress:", error);

      // Check if it's a session expiry error
      if (error.message === "SESSION_EXPIRED") {
        // Re-throw with specific type for the UI to handle
        // throw new Error("SESSION_EXPIRED");
      }

      throw error;
    }
  }

  async getLessonProgress(lessonKey: string): Promise<ProgressResponse> {
    try {
      const response = await fetchWithAuthRetry(
        `${API_URL}/progress/${lessonKey}`,
        {
          method: "GET",
        }
      );

      if (!response) {
        return {
          success: false,
          message: "",
        };
      }

      if (!response.ok) {
        if (response.status === 401) {
          // Authentication error - session might be expired
          // throw new Error("SESSION_EXPIRED");
          return {
            success: false,
            message: "",
          };
        }

        if (response.status === 404) {
          return {
            success: true,
            message: "No progress found for this lesson",
          };
        }

        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch progress");
      }

      return await response.json();
    } catch (error: any) {
      console.error("Error fetching lesson progress:", error);

      // Propagate session expiry
      if (error.message === "SESSION_EXPIRED") {
        throw new Error("SESSION_EXPIRED");
      }

      throw error;
    }
  }

  async getAllProgress(): Promise<{
    success: boolean;
    progress: LessonProgress[];
    message?: string;
  }> {
    try {
      const response = await fetchWithAuthRetry(`${API_URL}/progress`, {
        method: "GET",
      });

      if (!response) {
        return {
          success: false,
          progress: [],
        };
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch all progress");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching all progress:", error);
      throw error;
    }
  }

  async resetLessonProgress(lessonKey: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await fetchWithAuthRetry(
        `${API_URL}/reset-progress/${lessonKey}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset progress");
      }

      return await response.json();
    } catch (error) {
      console.error("Error resetting progress:", error);
      throw error;
    }
  }

  async completeLesson(
    lessonKey: string,
    totalPhases: number
  ): Promise<ProgressResponse> {
    try {
      return await this.updateLessonProgress(lessonKey, {
        phaseIndex: totalPhases - 1, // Last index (0-based)
        totalPhases,
      });
    } catch (error) {
      console.error("Error completing lesson:", error);
      throw error;
    }
  }

  async getProgressPercentage(lessonKey: string): Promise<{
    success: boolean;
    percentage: number;
    message?: string;
  }> {
    try {
      const response = await this.getLessonProgress(lessonKey);

      if (!response.success || !response.progress) {
        return {
          success: true,
          percentage: 0,
          message: response.message,
        };
      }

      const { lastPhaseIndex, totalPhases } = response.progress;
      const percentage =
        totalPhases > 0
          ? Math.round(((lastPhaseIndex + 1) / totalPhases) * 100)
          : 0;

      return {
        success: true,
        percentage,
        message: response.message,
      };
    } catch (error) {
      console.error("Error calculating progress percentage:", error);
      throw error;
    }
  }
}

export const progressService = new ProgressService();
