from typing import List, Dict, Any

class HealthEngine:
    @staticmethod
    def analyze_health_cases_for_source(cases_count: int, h2s_result: str, groundwater_trend: str) -> Dict[str, Any]:
        """
        Analyzes health report count alongside H2S bacterial test result and groundwater trend.
        Returns calculated risk level and risk explanation array.
        """
        explanations = []
        is_h2s_positive = h2s_result.lower() == 'positive'
        
        if is_h2s_positive:
            explanations.append("H₂S test positive for bacterial contamination")

        if cases_count >= 5:
            explanations.append(f"{cases_count} diarrhoea/gastro cases reported near source")
        elif cases_count > 0:
            explanations.append(f"{cases_count} health case(s) reported in cluster")

        if groundwater_trend == "Rising":
            explanations.append("Groundwater level rising rapidly (flood runoff risk)")
        elif groundwater_trend == "Declining":
            explanations.append("Groundwater table declining (scarcity risk)")

        # Determine status
        if is_h2s_positive and cases_count >= 5:
            status = "HIGH_RISK"
        elif is_h2s_positive or cases_count >= 3:
            status = "CONTAMINATION_RISK"
        elif groundwater_trend == "Declining":
            status = "AVAILABILITY_RISK"
        else:
            status = "SAFE"

        return {
            "status": status,
            "explanations": explanations
        }

health_engine = HealthEngine()
