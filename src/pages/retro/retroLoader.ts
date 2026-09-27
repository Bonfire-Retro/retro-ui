import {Retro, RetroService} from "../../services/retro-service/RetroService.ts";
import {ActionItem, ActionItemsService} from "../../services/action-items-service/ActionItemsService.ts";
import {LoaderFunctionArgs} from "react-router-dom";
import {hasShareToken} from "../../services/anonymous-auth/AnonymousAuthService.ts";
import {isAuthenticated, waitForAuthInitialization} from "../user/UserContext.ts";
import {FetchError} from "../../config/FetchClient.ts";

export type RetroPageLoaderData = {
    retro: Retro;
    actionItems: ActionItem[];
    isTeamMember: boolean;
}

type TeamMembership = Pick<RetroPageLoaderData, 'actionItems' | 'isTeamMember'>;

const NON_MEMBER: TeamMembership = {actionItems: [], isTeamMember: false};

/**
 * Membership is determined by whether the user can load the team's action items, which is restricted to team members.
 * A share token only grants access to the retro, so it must not decide the view: a team member may join via a share link.
 */
async function loadTeamMembership(teamId: string, retroId: string): Promise<TeamMembership> {
    await waitForAuthInitialization();
    if (!await isAuthenticated()) {
        return NON_MEMBER;
    }

    try {
        return {actionItems: await ActionItemsService.getActionItems(teamId), isTeamMember: true};
    } catch (error) {
        if (error instanceof FetchError && error.status === 403 && hasShareToken(retroId)) {
            return NON_MEMBER;
        }
        throw error;
    }
}

export async function loader({params}: LoaderFunctionArgs<{teamId: string, retroId: string}>): Promise<RetroPageLoaderData> {
    const [retro, membership] = await Promise.all([
        RetroService.getRetro(params.teamId!, params.retroId!),
        loadTeamMembership(params.teamId!, params.retroId!),
    ]);
    return {retro, ...membership};
}
