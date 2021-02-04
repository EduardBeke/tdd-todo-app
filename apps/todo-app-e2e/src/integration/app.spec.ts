import { getGreeting } from '../support/app.po';

describe('todo-app', () => {
	beforeEach(() => cy.visit('/'));

	it('should display welcome message', () => {
		getGreeting().contains('TodoApp');
	});
});
