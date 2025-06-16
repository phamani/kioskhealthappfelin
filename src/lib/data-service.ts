/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createServerClient } from "./supabase"

export interface User {
  id: string
  name: string
  age?: string
  sex?: string
  race?: string
  region?: string
  state?: string
  provider?: string
  product?: string
  mia_health_score?: string
  height?: string
  weight?: string
  waist?: string
  bmi_status?: string
  active?: string
  activity_level?: string
  smoker?: string
  current_medication?: string
  sleep_score?: string
  sleep_quality?: string
  phq9_score?: string
  devices?: string
  lmp?: string
  pregnant?: string
  pregnancy_age?: string
  medical_conditions?: string
  suspected_conditions?: string
  current_symptoms?: string
  medical_history?: string
  family_history?: string
  diabetes?: string
  hypertension?: string
  pregnancy_complications?: string
  mental_health?: string
}

export interface HealthReading {
  id: string
  user_id: string
  blood_pressure: string
  spo2: number
  heart_rate: number
  respiration_rate: number
  temperature: number
  glucose: number
  hba1c: number
  bmi: number
  hrv: number
  reading_date: string
}

export interface HealthTrend {
  id: string
  user_id: string
  trend_type: string
  blood_pressure_avg: string
  spo2_avg: number
  heart_rate_avg: number
  respiration_rate_avg: number
  temperature_avg: number
  glucose_avg: number
  hba1c_avg: number
  bmi_avg: number
  blood_pressure_trend: string
  spo2_trend: string
  heart_rate_trend: string
  respiration_rate_trend: string
  temperature_trend: string
  glucose_trend: string
  hba1c_trend: string
  bmi_trend: string
  calculated_at: string
}

export interface Assessment {
  id: string
  user_id: string
  assessment_type: string
  assessment_url: string
  created_at: string
}

export async function getUsers() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("users").select("*")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data
}

export async function getUserById(id: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching user with id ${id}:`, error)
    return null
  }

  return data
}

export async function getLatestHealthReading(userId: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("health_readings")
    .select("*")
    .eq("user_id", userId)
    .order("reading_date", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error(`Error fetching latest health reading for user ${userId}:`, error)
    return null
  }

  return data
}

export async function getHealthTrends(userId: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("health_trends")
    .select("*")
    .eq("user_id", userId)
    .order("calculated_at", { ascending: false })

  if (error) {
    console.error(`Error fetching health trends for user ${userId}:`, error)
    return []
  }

  // Group trends by type
  const trends: Record<string, HealthTrend> = {}
  data.forEach((trend) => {
    trends[trend.trend_type] = trend
  })

  return trends
}

export async function getUserAssessments(userId: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("assessments").select("*").eq("user_id", userId)

  if (error) {
    console.error(`Error fetching assessments for user ${userId}:`, error)
    return []
  }

  return data
}

export async function getAllHealthRecords() {
  const supabase = createServerClient()

  // Join users and their latest health readings
  const { data, error } = await supabase
    .from("users")
    .select(`
      *,
      health_readings:health_readings(*)
    `)
    .order("name")

  if (error) {
    console.error("Error fetching health records:", error)
    return []
  }

  // Process the data to get the latest reading for each user
  const records = data.map((user) => {
    const latestReading =
      user.health_readings.length > 0
        ? user.health_readings.sort(
            (a: any, b: any) => new Date(b.reading_date).getTime() - new Date(a.reading_date).getTime(),
          )[0]
        : null

    return {
      id: user.id,
      name: user.name,
      age: user.age,
      gender: user.sex,
      complaint: user.current_symptoms,
      riskCategory: user.suspected_conditions || "Unknown",
      riskLevel: determineRiskLevel(user, latestReading),
      bloodPressure: latestReading?.blood_pressure || "N/A",
      spo2: latestReading?.spo2 || 0,
      heartRate: latestReading?.heart_rate || 0,
      temperature: latestReading?.temperature || 0,
      respirationRate: latestReading?.respiration_rate || 0,
      trend: determineTrend(user.id), // This would need historical data to determine
    }
  })

  return records
}

// Helper function to determine risk level based on user data and readings
function determineRiskLevel(user: any, reading: any) {
  if (!reading) return "Low"

  // Simple logic - can be expanded based on medical criteria
  if (
    reading.heart_rate > 100 ||
    reading.heart_rate < 50 ||
    reading.spo2 < 90 ||
    reading.temperature > 38.5 ||
    user.suspected_conditions?.includes("COPD") ||
    user.suspected_conditions?.includes("CHF")
  ) {
    return "High"
  } else if (
    reading.heart_rate > 90 ||
    reading.heart_rate < 55 ||
    reading.spo2 < 95 ||
    reading.temperature > 37.8 ||
    user.smoker === "Yes"
  ) {
    return "Moderate"
  }

  return "Low"
}

// Placeholder function - would need historical data to determine trend
function determineTrend(userId: string) {
  // Random trend for demo purposes
  const trends = ["up", "down", "stable"]
  return trends[Math.floor(Math.random() * trends.length)] as "up" | "down" | "stable"
}
