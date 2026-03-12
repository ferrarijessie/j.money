import importlib

import pytest


def test_settings_requires_db_env_when_no_database_url(monkeypatch):
    monkeypatch.delenv('DATABASE_URL', raising=False)
    monkeypatch.delenv('DATABASE_USER', raising=False)
    monkeypatch.delenv('DATABASE_PASSWORD', raising=False)

    with pytest.raises(RuntimeError):
        importlib.import_module('settings.settings')
