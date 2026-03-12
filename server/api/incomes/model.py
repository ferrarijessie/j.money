from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import select

from database import db
from datetime import datetime

class IncomeType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    recurrent = db.Column(db.Boolean, default=False)
    base_value = db.Column(db.Numeric(precision=10, scale=2))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    income_values = db.relationship('Income', backref='income_type', cascade="all,delete", lazy=True)
    user = db.relationship('User', backref='income_type')

class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    month = db.Column(db.Integer, nullable=False, default=datetime.today().month)
    year = db.Column(db.Integer, nullable=False, default=datetime.today().year)
    type_id = db.Column(db.Integer, db.ForeignKey('income_type.id'), nullable=False)
    received = db.Column(db.Boolean, default=False)

    @property
    def type_name(self):
        return self.income_type.name

    @hybrid_property
    def user_id(self):
        return self.income_type.user_id

    @user_id.expression
    def user_id(cls):
        return (
            select(IncomeType.user_id)
            .where(IncomeType.id == cls.type_id)
            .scalar_subquery()
        )

    @property
    def user(self):
        return self.income_type.user