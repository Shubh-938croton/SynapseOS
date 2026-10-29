const BaseProvider = require("./baseProvider");

class MockProvider extends BaseProvider {
    async generateJSON(systemPrompt, userPrompt, options = {}) {
        // Extract operation type if embedded in options or detect from userPrompt
        const operation = options.operation || this._detectOperation(userPrompt);

        switch (operation) {
            case "daily_brief":
                return this._mockDailyBrief(userPrompt);
            case "insights":
                return this._mockInsights(userPrompt);
            case "planner":
                return this._mockPlanner(userPrompt);
            case "task_breakdown":
                return this._mockTaskBreakdown(userPrompt);
            case "weak_areas":
                return this._mockWeakAreas(userPrompt);
            case "weekly_review":
                return this._mockWeeklyReview(userPrompt);
            case "parse_task":
                return this._mockParseTask(userPrompt);
            default:
                return {
                    status: "success",
                    message: "Mock completion generated"
                };
        }
    }

    _detectOperation(prompt) {
        const lower = prompt.toLowerCase();
        if (lower.includes("daily brief") || lower.includes("daily_brief") || lower.includes("briefing assistant")) return "daily_brief";
        if (lower.includes("task_breakdown") || lower.includes("break down the following task")) return "task_breakdown";
        if (lower.includes("daily planner") || lower.includes("schedule plan")) return "planner";
        if (lower.includes("weak area") || lower.includes("weak_areas")) return "weak_areas";
        if (lower.includes("weekly review") || lower.includes("weekly_review")) return "weekly_review";
        if (lower.includes("parse task") || lower.includes("natural language task")) return "parse_task";
        return "insights";
    }

    _mockDailyBrief(userPrompt) {
        const taskIds = [];
        const matches = userPrompt.matchAll(/"(?:task_id|taskId)"\s*:\s*(\d+)/g);
        for (const match of matches) {
            taskIds.push(Number(match[1]));
        }

        const actionProposals = [];
        if (taskIds.length > 0) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split("T")[0];

            actionProposals.push({
                id: "prop_mock_1",
                action: "RESCHEDULE_TASK",
                targetEntityType: "task",
                targetEntityId: taskIds[0],
                currentValue: "2026-09-20",
                proposedValue: tomorrowStr,
                reason: "Rescheduling overdue deliverable to a realistic focus slot.",
                evidence: ["Task has passed its original due date"]
            });
        }

        return {
            date: new Date().toISOString().split("T")[0],
            executiveSummary: "Today's priority is dedicated to completing core assignment deliverables and sustaining daily study momentum.",
            signalsInterpretation: [
                {
                    signalType: "PRIORITY_ALIGNMENT",
                    analysis: "High-value assignments are positioned for active execution.",
                    recommendedFocus: "Dedicate early study blocks to key milestones."
                }
            ],
            priorities: [
                "Execute top active milestone assignments",
                "Complete a 45-minute focused study session"
            ],
            actionProposals,
            warnings: taskIds.length > 0 ? ["You have active pending tasks to review today."] : []
        };
    }

    _mockInsights(userPrompt) {
        return {
            insights: [
                {
                    title: "High Task Momentum",
                    description: "You maintained strong completion velocity across your assignments.",
                    category: "productivity",
                    evidence: ["Completed tasks recorded in your recent study window"]
                },
                {
                    title: "Consistent Focus Intervals",
                    description: "Your structured Pomodoro sessions supported your primary coursework.",
                    category: "focus",
                    evidence: ["Recorded focus sessions logged in your activity stream"]
                },
                {
                    title: "Goal Alignment",
                    description: "Your daily study activity directly supports your active milestone targets.",
                    category: "goals",
                    evidence: ["Active goals tracked in your workspace"]
                }
            ],
            summary: "Productive momentum observed across your core workspaces."
        };
    }

    _mockPlanner(userPrompt) {
        // Attempt to parse task IDs from userPrompt context
        const taskIds = [];
        const matches = userPrompt.matchAll(/"(?:task_id|taskId)"\s*:\s*(\d+)/g);
        for (const match of matches) {
            taskIds.push(Number(match[1]));
        }

        const planItems = [];
        const sampleTasks = taskIds.slice(0, 3);
        const startTimes = ["09:00", "11:00", "14:30"];

        sampleTasks.forEach((taskId, idx) => {
            planItems.push({
                taskId,
                suggestedStart: startTimes[idx] || "10:00",
                suggestedDurationMinutes: 45,
                priority: "High",
                reason: "Prioritized based on due date and active coursework objectives."
            });
        });

        return {
            date: new Date().toISOString().split("T")[0],
            totalPlannedMinutes: planItems.length * 45,
            plan: planItems,
            recommendations: [
                "Take a 5-minute break between deep focus blocks.",
                "Review completed milestones at the end of the day."
            ]
        };
    }

    _mockTaskBreakdown(userPrompt) {
        return {
            originalTask: "Prepare Deliverable",
            totalEstimatedMinutes: 135,
            steps: [
                {
                    stepNumber: 1,
                    title: "Review requirements and organize key reference materials",
                    estimatedMinutes: 30,
                    actionableAdvice: "Outline the primary objectives and gather necessary notes."
                },
                {
                    stepNumber: 2,
                    title: "Implement core solution and draft initial milestones",
                    estimatedMinutes: 60,
                    actionableAdvice: "Focus on the fundamental logic and architecture."
                },
                {
                    stepNumber: 3,
                    title: "Verify edge cases and conduct self-review",
                    estimatedMinutes: 45,
                    actionableAdvice: "Test thoroughly against problem constraints before submission."
                }
            ]
        };
    }

    _mockWeakAreas(userPrompt) {
        return {
            hasSufficientData: true,
            status: "analysis_complete",
            areas: [
                {
                    subjectId: 1,
                    subjectName: "Operating Systems",
                    concernLevel: "Moderate",
                    reason: "Task completion rate is lower relative to your other active subjects.",
                    evidence: {
                        completionRate: "50%",
                        overdueCount: 1,
                        recordedStudyHours: "2.5h"
                    },
                    recommendedAction: "Schedule a dedicated 45-minute focus session to address pending assignments."
                }
            ],
            summary: "Identified 1 subject requiring attention to restore balanced academic progress."
        };
    }

    _mockWeeklyReview(userPrompt) {
        return {
            reviewPeriod: "Past 7 Days",
            executiveSummary: "Solid weekly productivity with active engagement across core deliverables.",
            factualHighlights: [
                "Consistent activity recorded across weekday study windows.",
                "Regular focus intervals completed during peak study hours."
            ],
            observations: [
                "Productivity peaked mid-week with highest completed task volume.",
                "Study session duration remained balanced with short breaks."
            ],
            areasNeedingAttention: [
                "Address upcoming deadlines early in the week to avoid weekend rollovers."
            ],
            recommendedPrioritiesNextWeek: [
                "Complete pending milestones in your primary coursework.",
                "Maintain your active study streak with daily focus blocks."
            ]
        };
    }

    _mockParseTask(userPrompt) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];

        return {
            title: "Study Operating Systems Lab",
            description: "Review lab exercise and complete assignment questions",
            dueDate: tomorrowStr,
            suggestedTime: "17:00",
            durationMinutes: 60,
            priority: "High",
            subjectId: 1,
            subjectName: "Operating Systems",
            confidence: 0.95
        };
    }
}

module.exports = MockProvider;
