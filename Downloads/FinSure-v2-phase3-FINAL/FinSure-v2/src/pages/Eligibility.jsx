import Navbar from "../components/Navbar"
import { useState } from "react"

import translations from "../translations/translations"

import { motion } from "framer-motion"

import { Link } from "react-router-dom"

function Eligibility() {

  // Language
  const [language, setLanguage] =
    useState("en")

  const t =
    translations[language]

  // States
  const [salary, setSalary] =
    useState("")

  const [creditScore, setCreditScore] =
    useState("")

  const [age, setAge] =
    useState("")

  const [existingLoan, setExistingLoan] =
    useState("")

  const [employmentType, setEmploymentType] =
    useState("Salaried")

  const [loanType, setLoanType] =
    useState("Home Loan")

  const [showResult, setShowResult] =
    useState(false)

  // REALTIME FinDNA Score
  let readinessScore = 0

  // Salary Score
  if (salary >= 100000)
    readinessScore += 30

  else if (salary >= 70000)
    readinessScore += 24

  else if (salary >= 50000)
    readinessScore += 18

  else if (salary >= 30000)
    readinessScore += 12

  else if (salary > 0)
    readinessScore += 6

  // Credit Score
  if (creditScore >= 800)
    readinessScore += 30

  else if (creditScore >= 750)
    readinessScore += 25

  else if (creditScore >= 700)
    readinessScore += 20

  else if (creditScore >= 650)
    readinessScore += 15

  else if (creditScore > 0)
    readinessScore += 8

  // EMI Ratio
  const emiRatio =
    salary > 0
      ? Math.round(
          (existingLoan / salary) * 100
        )
      : 0

  if (emiRatio <= 20)
    readinessScore += 25

  else if (emiRatio <= 35)
    readinessScore += 20

  else if (emiRatio <= 50)
    readinessScore += 12

  else
    readinessScore += 5

  // Age Score
  if (age >= 25 && age <= 45)
    readinessScore += 10

  else if (
    (age >= 21 && age < 25) ||
    (age > 45 && age <= 55)
  )
    readinessScore += 7

  else if (age > 0)
    readinessScore += 4

  // Employment Stability
  if (
    employmentType === t.salaried
  )
    readinessScore += 5

  else if (
    employmentType === t.businessOwner
  )
    readinessScore += 4

  else
    readinessScore += 3

  // Final Limits
  if (readinessScore > 100)
    readinessScore = 100

  if (readinessScore < 0)
    readinessScore = 0

  // Status
  let status = ""

  let statusColor = ""

  if (readinessScore >= 80) {

    status =
      t.premiumDNA

    statusColor =
      "text-green-400"

  }

  else if (
    readinessScore >= 60
  ) {

    status =
      t.balancedDNA

    statusColor =
      "text-yellow-400"

  }

  else {

    status =
      t.riskDNA

    statusColor =
      "text-red-400"

  }

  // Financial Health
  let health = ""

  let healthColor = ""

  if (emiRatio <= 30) {

    health =
      t.stableDNA

    healthColor =
      "text-green-400"

  }

  else if (
    emiRatio <= 50
  ) {

    health =
      t.moderatePressure

    healthColor =
      "text-yellow-400"

  }

  else {

    health =
      t.criticalPressure

    healthColor =
      "text-red-400"

  }

  // Personality
  let personality = ""

  if (readinessScore >= 80) {

    personality =
      t.strategicBorrower

  }

  else if (
    readinessScore >= 60
  ) {

    personality =
      t.growthProfile

  }

  else {

    personality =
      t.recoveryProfile

  }

  // Eligible Loan
  let eligibleLoan = 0

  if (salary > 0) {

    eligibleLoan = Math.round(

      (
        salary -
        existingLoan
      ) * 35

    )

  }

  return (

    <div className="bg-slate-950 min-h-screen text-white p-5 md:p-10">

      {/* Back */}
      <Link to="/">

        <button className="mb-8 bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-cyan-300 transition">

          ← Back

        </button>

      </Link>

      {/* Main */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-10"
      >

        {/* Language */}
        <div className="flex justify-end mb-6">

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 outline-none"
          >

            <option value="en">
              English
            </option>

            <option value="hi">
              हिंदी
            </option>

            <option value="mr">
              Marathi
            </option>

          </select>

        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-bold text-cyan-400 text-center">

          {t.eligibilityTitle}

        </h1>

        <p className="text-center text-slate-400 mt-5 text-sm md:text-lg max-w-4xl mx-auto leading-relaxed">

          {t.eligibilitySubtitle}

        </p>

        {/* Inputs */}
        <div className="grid md:grid-cols-3 gap-5 mt-12">

          <input
            type="number"
            placeholder={t.salary}
            onChange={(e) =>
              setSalary(Number(e.target.value))
            }
            className="bg-slate-950 border border-slate-700 rounded-2xl p-4 md:p-5 outline-none focus:border-cyan-400"
          />

          <input
            type="number"
            placeholder={t.creditScore}
            onChange={(e) =>
              setCreditScore(Number(e.target.value))
            }
            className="bg-slate-950 border border-slate-700 rounded-2xl p-4 md:p-5 outline-none focus:border-cyan-400"
          />

          <input
            type="number"
            placeholder={t.age}
            onChange={(e) =>
              setAge(Number(e.target.value))
            }
            className="bg-slate-950 border border-slate-700 rounded-2xl p-4 md:p-5 outline-none focus:border-cyan-400"
          />

          <input
            type="number"
            placeholder={t.existingEmi}
            onChange={(e) =>
              setExistingLoan(Number(e.target.value))
            }
            className="bg-slate-950 border border-slate-700 rounded-2xl p-4 md:p-5 outline-none focus:border-cyan-400"
          />

          <select
            onChange={(e) =>
              setEmploymentType(e.target.value)
            }
            className="bg-slate-950 border border-slate-700 rounded-2xl p-4 md:p-5 outline-none focus:border-cyan-400"
          >

            <option>
              {t.salaried}
            </option>

            <option>
              {t.selfEmployed}
            </option>

            <option>
              {t.businessOwner}
            </option>

          </select>

          <select
            onChange={(e) =>
              setLoanType(e.target.value)
            }
            className="bg-slate-950 border border-slate-700 rounded-2xl p-4 md:p-5 outline-none focus:border-cyan-400"
          >

            <option>
              {t.homeLoan}
            </option>

            <option>
              {t.personalLoan}
            </option>

            <option>
              {t.educationLoan}
            </option>

            <option>
              {t.carLoan}
            </option>

          </select>

        </div>

        {/* Analyze */}
        <div className="flex justify-center mt-10">

          <button
            onClick={() =>
              setShowResult(true)
            }
            className="bg-cyan-400 text-black px-10 py-4 rounded-2xl font-bold hover:bg-cyan-300 transition duration-300 shadow-lg shadow-cyan-500/20"
          >

            {t.analyze}

          </button>

        </div>

        {/* Results */}
        {showResult && (

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-14"
          >

            <div className="grid md:grid-cols-2 gap-6">

              {/* Score */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">

                <h2 className="text-2xl font-bold text-cyan-400">

                  {t.eligibilityScore}

                </h2>

                <p className="text-5xl font-extrabold mt-6">

                  {readinessScore}/100

                </p>

                <p className={`mt-5 text-xl font-bold ${statusColor}`}>

                  {status}

                </p>

              </div>

              {/* Health */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">

                <h2 className="text-2xl font-bold text-cyan-400">

                  {t.health}

                </h2>

                <p className={`mt-6 text-2xl font-bold ${healthColor}`}>

                  {health}

                </p>

                <p className="text-slate-400 mt-5">

                  {personality}

                </p>

              </div>

            </div>

            {/* Loan */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 mt-8">

              <h2 className="text-2xl font-bold text-cyan-400">

                {t.loanAmount}

              </h2>

              <p className="text-5xl font-extrabold mt-6">

                ₹ {eligibleLoan}

              </p>

              <p className="text-slate-400 mt-4">

                {loanType}

              </p>

            </div>

          </motion.div>

        )}

      </motion.div>

    </div>
  )
}

export default Eligibility