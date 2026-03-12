from mock import patch, Mock

from api.summary.service import SummaryService


class TestSummaryServiceYearly:
    def test_get_summary_yearly(self, client):
        incomes = [Mock(value=1000), Mock(value=250)]
        expenses = [Mock(value=100), Mock(value=50)]
        savings = [Mock(value=300)]

        with patch('api.summary.service.IncomeService.get_incomes_by_year', return_value=incomes), \
             patch('api.summary.service.ExpenseService.get_expense_by_year', return_value=expenses), \
             patch('api.summary.service.SavingValueService.get_unused_by_year', return_value=savings):
            result = SummaryService.get_summary_yearly(year=2024, user_id=1)

        assert result['incomes_total'] == 1250
        assert result['expenses_total'] == 150
        assert result['savings_total'] == 300
        assert result['balance'] == 1250 - (150 + 300)
