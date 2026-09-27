import {loader} from './retroLoader';
import {RetroService} from '../../services/retro-service/RetroService';
import {ActionItemsService} from '../../services/action-items-service/ActionItemsService';
import {isAuthenticated, waitForAuthInitialization} from '../user/UserContext';
import {hasShareToken} from '../../services/anonymous-auth/AnonymousAuthService';
import {FetchError} from '../../config/FetchClient';
import {Mock} from 'vitest';

vi.mock('../../services/retro-service/RetroService', () => ({
    RetroService: {getRetro: vi.fn()},
}));
vi.mock('../../services/action-items-service/ActionItemsService', () => ({
    ActionItemsService: {getActionItems: vi.fn()},
}));
vi.mock('../user/UserContext', () => ({
    isAuthenticated: vi.fn(),
    waitForAuthInitialization: vi.fn(),
}));
vi.mock('../../services/anonymous-auth/AnonymousAuthService', () => ({
    hasShareToken: vi.fn(),
}));
vi.mock('../../config/FetchClient', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../config/FetchClient')>();
    return {FetchError: actual.FetchError};
});

const mockGetRetro = RetroService.getRetro as Mock;
const mockGetActionItems = ActionItemsService.getActionItems as Mock;
const mockIsAuthenticated = isAuthenticated as Mock;
const mockWaitForAuthInitialization = waitForAuthInitialization as Mock;
const mockHasShareToken = hasShareToken as Mock;

const retro = {id: 'retro-1', teamId: 'team-1'};
const actionItems = [{id: 'action-1'}];

function runLoader() {
    return loader({params: {teamId: 'team-1', retroId: 'retro-1'}} as never);
}

describe('retroLoader', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetRetro.mockResolvedValue(retro);
        mockGetActionItems.mockResolvedValue(actionItems);
        mockWaitForAuthInitialization.mockResolvedValue(undefined);
        mockIsAuthenticated.mockResolvedValue(true);
        mockHasShareToken.mockReturnValue(false);
    });

    it('treats an authenticated team member as a member and loads action items', async () => {
        const result = await runLoader();

        expect(result).toEqual({retro, actionItems, isTeamMember: true});
        expect(mockGetActionItems).toHaveBeenCalledWith('team-1');
    });

    it('treats an authenticated team member with a share token as a member', async () => {
        mockHasShareToken.mockReturnValue(true);

        const result = await runLoader();

        expect(result).toEqual({retro, actionItems, isTeamMember: true});
    });

    it('treats an unauthenticated user as a non-member without loading action items', async () => {
        mockIsAuthenticated.mockResolvedValue(false);
        mockHasShareToken.mockReturnValue(true);

        const result = await runLoader();

        expect(result).toEqual({retro, actionItems: [], isTeamMember: false});
        expect(mockGetActionItems).not.toHaveBeenCalled();
    });

    it('treats an authenticated non-member with a share token as a non-member', async () => {
        mockHasShareToken.mockReturnValue(true);
        mockGetActionItems.mockRejectedValue(new FetchError('Forbidden', 403, null));

        const result = await runLoader();

        expect(result).toEqual({retro, actionItems: [], isTeamMember: false});
    });

    it('rethrows a forbidden error when there is no share token', async () => {
        const error = new FetchError('Forbidden', 403, null);
        mockGetActionItems.mockRejectedValue(error);

        await expect(runLoader()).rejects.toBe(error);
    });

    it('rethrows non-forbidden errors even with a share token', async () => {
        mockHasShareToken.mockReturnValue(true);
        const error = new FetchError('Server error', 500, null);
        mockGetActionItems.mockRejectedValue(error);

        await expect(runLoader()).rejects.toBe(error);
    });
});
