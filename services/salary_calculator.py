import logging
from typing import Dict, Optional, Union
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, date

logger = logging.getLogger(__name__)

class SalaryCalculator:
    """
    A service for calculating various salary components including base salary, 
    bonuses, deductions, and net salary.
    """
    
    def __init__(self):
        self.tax_brackets = {
            'IN': [
                (0, 250000, 0.0),
                (250001, 500000, 0.05),
                (500001, 750000, 0.10),
                (750001, 1000000, 0.15),
                (1000001, 1250000, 0.20),
                (1250001, 1500000, 0.25),
                (1500001, float('inf'), 0.30)
            ],
            'US': [
                (0, 10275, 0.10),
                (10276, 41775, 0.12),
                (41776, 89075, 0.22),
                (89076, 170050, 0.24),
                (170051, 215950, 0.32),
                (215951, 539900, 0.35),
                (539901, float('inf'), 0.37)
            ],
            'UK': [
                (0, 12570, 0.0),
                (12571, 50270, 0.20),
                (50271, 150000, 0.40),
                (150001, float('inf'), 0.45)
            ]
        }
        
        # Standard deduction rates (annual)
        self.standard_deductions = {
            'IN': 50000,  # Standard deduction under section 16(ia)
            'US': 12950,  # Standard deduction for single filers (2022)
            'UK': 12570   # Personal allowance (2022/23)
        }
        
        # Common benefit rates (as percentage of base salary)
        self.benefit_rates = {
            'provident_fund': 12.0,  # Employee's contribution to PF
            'professional_tax': 200,  # Monthly professional tax (approx)
            'health_insurance': 5.0    # Health insurance premium (percentage of base)
        }
    
    def calculate_tax(self, annual_income: float, country_code: str = 'IN', 
                     deductions: Optional[Dict[str, float]] = None) -> Dict[str, float]:
        """
        Calculate income tax based on annual income and country's tax brackets.
        
        Args:
            annual_income: Annual gross income
            country_code: Country code for tax calculation (IN/US/UK)
            deductions: Dictionary of additional deductions
            
        Returns:
            Dictionary containing tax details
        """
        if country_code not in self.tax_brackets:
            raise ValueError(f"Tax brackets not available for country: {country_code}")
        
        # Apply standard deduction
        taxable_income = annual_income - self.standard_deductions.get(country_code, 0)
        taxable_income = max(0, taxable_income)
        
        # Apply additional deductions if provided
        if deductions:
            taxable_income -= sum(deductions.values())
            taxable_income = max(0, taxable_income)
        
        # Calculate tax based on brackets
        tax = 0
        remaining_income = taxable_income
        
        for lower, upper, rate in self.tax_brackets[country_code]:
            if remaining_income <= 0:
                break
                
            bracket_amount = min(remaining_income, upper - lower + 1)
            tax += bracket_amount * rate
            remaining_income -= bracket_amount
        
        # Apply surcharge if applicable (India specific)
        if country_code == 'IN' and annual_income > 5000000:  # Above 50L
            surcharge = 0.10  # 10% surcharge
            tax += tax * surcharge
        
        # Add health and education cess (India specific, 4% of tax)
        if country_code == 'IN':
            tax *= 1.04
        
        return {
            'gross_income': annual_income,
            'taxable_income': taxable_income,
            'tax_amount': round(tax, 2),
            'effective_tax_rate': round((tax / annual_income) * 100, 2) if annual_income > 0 else 0
        }
    
    def calculate_net_salary(self, base_salary: float, country_code: str = 'IN',
                           bonuses: Optional[Dict[str, float]] = None,
                           deductions: Optional[Dict[str, float]] = None) -> Dict[str, float]:
        """
        Calculate net salary after all deductions and additions.
        
        Args:
            base_salary: Annual base salary
            country_code: Country code for tax calculation
            bonuses: Dictionary of bonus amounts (e.g., {'performance': 10000})
            deductions: Dictionary of deduction amounts
            
        Returns:
            Dictionary containing salary breakdown
        """
        # Initialize bonuses and deductions if not provided
        bonuses = bonuses or {}
        deductions = deductions or {}
        
        # Calculate total bonuses
        total_bonus = sum(bonuses.values()) if bonuses else 0
        
        # Calculate standard benefits/deductions
        pf_contribution = (self.benefit_rates['provident_fund'] / 100) * base_salary
        health_insurance = (self.benefit_rates['health_insurance'] / 100) * base_salary
        
        # Add standard deductions
        standard_deductions = {
            'provident_fund': pf_contribution,
            'professional_tax': self.benefit_rates['professional_tax'] * 12,  # Annual
            'health_insurance': health_insurance
        }
        
        # Combine all deductions
        all_deductions = {**standard_deductions, **(deductions or {})}
        
        # Calculate gross income (base + bonuses)
        gross_income = base_salary + total_bonus
        
        # Calculate tax
        tax_details = self.calculate_tax(
            gross_income,
            country_code=country_code,
            deductions=all_deductions
        )
        
        # Calculate net salary
        total_deductions = sum(all_deductions.values()) + tax_details['tax_amount']
        net_salary = gross_income - total_deductions
        
        # Prepare detailed breakdown
        breakdown = {
            'base_salary': base_salary,
            'total_bonus': total_bonus,
            'gross_income': gross_income,
            'tax_details': tax_details,
            'deductions': all_deductions,
            'total_deductions': total_deductions,
            'net_salary': round(net_salary, 2),
            'monthly_net': round(net_salary / 12, 2),
            'currency': self._get_currency(country_code)
        }
        
        return breakdown
    
    def calculate_ctc(self, base_salary: float, country_code: str = 'IN',
                     benefits: Optional[Dict[str, float]] = None) -> Dict[str, float]:
        """
        Calculate Cost to Company (CTC) including all benefits.
        
        Args:
            base_salary: Annual base salary
            country_code: Country code for benefit calculations
            benefits: Additional benefits provided by the company
            
        Returns:
            Dictionary containing CTC breakdown
        """
        benefits = benefits or {}
        
        # Standard employer contributions (India specific)
        standard_benefits = {
            'employer_pf': (12 / 100) * base_salary,  # Employer's PF contribution
            'gratuity': (4.81 / 100) * base_salary,    # Gratuity (after 5 years)
            'medical_insurance': 15000,                # Approximate annual premium
            'variable_pay': 0.1 * base_salary          # Typical variable pay
        }
        
        # Add any additional benefits
        all_benefits = {**standard_benefits, **benefits}
        
        # Calculate CTC
        ctc = base_salary + sum(all_benefits.values())
        
        return {
            'base_salary': base_salary,
            'benefits': all_benefits,
            'total_benefits': sum(all_benefits.values()),
            'ctc': ctc,
            'currency': self._get_currency(country_code)
        }
    
    def _get_currency(self, country_code: str) -> str:
        """Get currency symbol based on country code."""
        currencies = {
            'IN': '₹',  # Indian Rupee
            'US': '$',  # US Dollar
            'UK': '£'   # British Pound
        }
        return currencies.get(country_code, '$')
    
    def format_currency(self, amount: float, currency: str) -> str:
        """Format amount with appropriate currency symbol and formatting."""
        if currency == '₹':
            # Indian format: ₹1,00,000.00
            return f"{currency}{amount:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
        else:
            # Standard format: $100,000.00
            return f"{currency}{amount:,.2f}"

# Create a singleton instance
salary_calculator = SalaryCalculator()
