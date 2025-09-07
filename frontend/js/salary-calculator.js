class SalaryCalculator {
    constructor() {
        this.form = document.getElementById('salary-form');
        this.resultsContainer = document.getElementById('salary-results');
        
        // Output elements
        this.salaryAmountEl = document.getElementById('salary-amount');
        this.monthlyNetEl = document.getElementById('monthly-net');
        this.yearlyNetEl = document.getElementById('yearly-net');
        this.taxAmountEl = document.getElementById('tax-amount');
        this.salaryBreakdownEl = document.getElementById('salary-breakdown');
        this.ctcBreakdownEl = document.getElementById('ctc-breakdown');

        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            // Add input event listeners for real-time updates
            this.form.querySelectorAll('input, select').forEach(input => {
                input.addEventListener('change', () => this.calculateSalary());
                input.addEventListener('input', () => this.calculateSalary());
            });
        } else {
            console.error('Salary form not found');
        }
    }

    // Calculate tax based on country and income
    calculateTax(income, country) {
        // Tax brackets for different countries (simplified)
        const taxBrackets = {
            'IN': [
                { min: 0, max: 250000, rate: 0 },
                { min: 250001, max: 500000, rate: 0.05 },
                { min: 500001, max: 750000, rate: 0.1 },
                { min: 750001, max: 1000000, rate: 0.15 },
                { min: 1000001, max: 1250000, rate: 0.2 },
                { min: 1250001, max: 1500000, rate: 0.25 },
                { min: 1500001, max: Infinity, rate: 0.3 }
            ],
            'US': [
                { min: 0, max: 10275, rate: 0.1 },
                { min: 10276, max: 41775, rate: 0.12 },
                { min: 41776, max: 89075, rate: 0.22 },
                { min: 89076, max: 170050, rate: 0.24 },
                { min: 170051, max: 215950, rate: 0.32 },
                { min: 215951, max: 539900, rate: 0.35 },
                { min: 539901, max: Infinity, rate: 0.37 }
            ],
            'UK': [
                { min: 0, max: 12570, rate: 0 },
                { min: 12571, max: 50270, rate: 0.2 },
                { min: 50271, max: 150000, rate: 0.4 },
                { min: 150001, max: Infinity, rate: 0.45 }
            ]
        };

        const brackets = taxBrackets[country] || taxBrackets['IN'];
        let tax = 0;
        let remainingIncome = income;

        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;
            
            const taxableInBracket = Math.min(
                remainingIncome,
                bracket.max === Infinity ? remainingIncome : bracket.max - bracket.min + 1
            );
            
            tax += taxableInBracket * bracket.rate;
            remainingIncome -= taxableInBracket;
        }

        return Math.round(tax);
    }

    // Calculate all salary components
    calculateSalary() {
        try {
            const formData = new FormData(this.form);
            const baseSalary = parseFloat(formData.get('base_salary') || 0);
            const country = formData.get('country') || 'IN';
            const experience = parseInt(formData.get('experience') || 1);
            
            // Get bonus values
            const performanceBonus = parseFloat(formData.get('performance_bonus') || 0);
            const joiningBonus = parseFloat(formData.get('joining_bonus') || 0);
            const otherBonus = parseFloat(formData.get('other_bonus') || 0);
            const totalBonus = performanceBonus + joiningBonus + otherBonus;
            
            // Get deduction values
            const pf = parseFloat(formData.get('pf') || 0);
            const professionalTax = parseFloat(formData.get('professional_tax') || 0);
            const insurance = parseFloat(formData.get('insurance') || 0);
            const otherDeductions = parseFloat(formData.get('other_deductions') || 0);
            const totalDeductions = pf + professionalTax + insurance + otherDeductions;
            
            // Calculate components (simplified for demo)
            const hra = Math.min(0.5 * baseSalary, 500000); // 50% of basic or 5L limit
            const lta = Math.min(0.1 * baseSalary, 100000); // 10% of basic or 1L limit
            const specialAllowance = 0.3 * baseSalary; // 30% of basic
            
            // Calculate gross and taxable income
            const grossSalary = baseSalary + hra + lta + specialAllowance + totalBonus;
            const taxableIncome = grossSalary - (pf + professionalTax + insurance);
            
            // Calculate tax based on country
            const taxAmount = this.calculateTax(taxableIncome, country);
            
            // Calculate net amounts
            const yearlyNet = grossSalary - taxAmount - totalDeductions;
            const monthlyNet = yearlyNet / 12;
            
            // Prepare result object
            const result = {
                baseSalary,
                grossSalary,
                yearlyNet,
                monthlyNet,
                taxAmount,
                totalDeductions,
                totalBonus,
                components: {
                    hra,
                    lta,
                    specialAllowance,
                    performanceBonus,
                    joiningBonus,
                    otherBonus,
                    pf,
                    professionalTax,
                    insurance,
                    otherDeductions
                },
                currency: country === 'IN' ? '₹' : country === 'UK' ? '£' : '$'
            };
            
            this.displayResults(result);
            return result;
            
        } catch (error) {
            console.error('Error calculating salary:', error);
            return null;
        }
    }

    // Handle form submission
    handleSubmit(e) {
        e.preventDefault();
        this.toggleLoading(true);
        
        try {
            const result = this.calculateSalary();
            if (result) {
                this.resultsContainer.style.display = 'block';
                // Smooth scroll to results
                this.resultsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('Failed to calculate salary. Please check your inputs.');
        } finally {
            this.toggleLoading(false);
        }
    }

    // Format currency based on country
    formatCurrency(amount, currency) {
        if (isNaN(amount)) return `${currency}0`;
        
        const formatter = new Intl.NumberFormat(
            currency === '₹' ? 'en-IN' : 
            currency === '£' ? 'en-GB' : 'en-US', 
            {
                style: 'currency',
                currency: currency === '₹' ? 'INR' : 
                         currency === '£' ? 'GBP' : 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        );
        
        return formatter.format(amount).replace(/^\D+/, currency);
    }

    // Display the calculated results
    displayResults(data) {
        if (!data) return;
        
        const { currency } = data;
        
        // Update main salary displays
        this.salaryAmountEl.textContent = this.formatCurrency(data.grossSalary, currency);
        this.monthlyNetEl.textContent = this.formatCurrency(data.monthlyNet, currency);
        this.yearlyNetEl.textContent = this.formatCurrency(data.yearlyNet, currency);
        this.taxAmountEl.textContent = this.formatCurrency(data.taxAmount, currency);
        
        // Generate salary breakdown HTML
        this.salaryBreakdownEl.innerHTML = `
            <div class="breakdown-item">
                <span>Basic Salary</span>
                <span>${this.formatCurrency(data.baseSalary, currency)}</span>
            </div>
            <div class="breakdown-item">
                <span>HRA</span>
                <span>${this.formatCurrency(data.components.hra, currency)}</span>
            </div>
            <div class="breakdown-item">
                <span>LTA</span>
                <span>${this.formatCurrency(data.components.lta, currency)}</span>
            </div>
            <div class="breakdown-item">
                <span>Special Allowance</span>
                <span>${this.formatCurrency(data.components.specialAllowance, currency)}</span>
            </div>
            <div class="breakdown-item total">
                <span>Total Earnings</span>
                <span>${this.formatCurrency(data.grossSalary, currency)}</span>
            </div>
        `;
        
        // Generate CTC breakdown HTML
        this.ctcBreakdownEl.innerHTML = `
            <div class="breakdown-item">
                <span>Gross Salary</span>
                <span>${this.formatCurrency(data.grossSalary, currency)}</span>
            </div>
            <div class="breakdown-item">
                <span>Bonus & Incentives</span>
                <span>+${this.formatCurrency(data.totalBonus, currency)}</span>
            </div>
            <div class="breakdown-item">
                <span>Income Tax</span>
                <span>-${this.formatCurrency(data.taxAmount, currency)}</span>
            </div>
            <div class="breakdown-item">
                <span>PF & Other Deductions</span>
                <span>-${this.formatCurrency(data.totalDeductions, currency)}</span>
            </div>
            <div class="breakdown-item total">
                <span>Net Take Home (Yearly)</span>
                <span>${this.formatCurrency(data.yearlyNet, currency)}</span>
            </div>
        `;
    }

    toggleLoading(show) {
        const loadingElement = document.getElementById('salary-loading');
        if (loadingElement) {
            loadingElement.classList.toggle('hidden', !show);
        }
    }

    showError(message) {
        // You can replace this with a more sophisticated error display
        alert(message);
    }
}

// Initialize the salary calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('salary-form')) {
        window.salaryCalculator = new SalaryCalculator();
    }
});
