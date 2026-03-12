from types import SimpleNamespace

from mock import patch
from flask import Flask, g

from auth import load_user_from_request, CustomSessionInterface


class TestAuthHelpers:
    def test_load_user_from_request_no_header_returns_none(self, client):
        request = SimpleNamespace(headers={})
        assert load_user_from_request(request) is None

    def test_load_user_from_request_invalid_token_returns_none(self, client):
        request = SimpleNamespace(headers={'X-Api-Key': 'does-not-exist'})

        with patch('api.auth.model.User.query') as query:
            query.filter.return_value.first.return_value = None
            assert load_user_from_request(request) is None

    def test_custom_session_interface_does_not_save_for_api_requests(self, client):
        app = Flask(__name__)
        session_interface = CustomSessionInterface()

        with app.app_context():
            g.login_via_request = True
            assert session_interface.save_session(app, None, None) is None

    def test_custom_session_interface_saves_for_non_api_requests(self, client):
        app = Flask(__name__)
        session_interface = CustomSessionInterface()

        with patch('flask.sessions.SecureCookieSessionInterface.save_session', return_value='ok') as save_session:
            with app.app_context():
                g.login_via_request = False
                assert session_interface.save_session(app, None, None) == 'ok'

        assert save_session.called
