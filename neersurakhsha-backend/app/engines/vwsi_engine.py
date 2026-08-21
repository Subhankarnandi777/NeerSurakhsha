from typing import List, Dict, Any

class VWSIEngine:
    @staticmethod
    def calculate_vwsi(water_sources: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates Village Water Security Index (VWSI) based on water source safety statuses.
        VWSI Score ranges from 0 to 100 (100 = Excellent Water Security).
        """
        if not water_sources:
            return {"score": 50, "grade": "MODERATE", "summary": "No water sources registered"}

        total_sources = len(water_sources)
        safe_count = sum(1 for s in water_sources if s.get("status") == "SAFE")
        high_risk_count = sum(1 for s in water_sources if s.get("status") == "HIGH_RISK")
        contamination_count = sum(1 for s in water_sources if s.get("status") == "CONTAMINATION_RISK")

        # Score math
        score = int(((safe_count * 100) + (contamination_count * 40) + (high_risk_count * 0)) / total_sources)

        if score >= 80:
            grade = "SECURE"
        elif score >= 50:
            grade = "MODERATE_RISK"
        else:
            grade = "CRITICAL_RISK"

        return {
            "score": score,
            "grade": grade,
            "total_sources": total_sources,
            "safe_sources": safe_count,
            "high_risk_sources": high_risk_count,
            "contamination_risk_sources": contamination_count,
        }

vwsi_engine = VWSIEngine()
