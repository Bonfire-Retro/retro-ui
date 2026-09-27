import {RetroContextProvider} from "../../context/retro/RetroContext.tsx";
import {RetroComponent} from "./Retro.tsx";
import {ActionItemsContextProvider} from "../../context/action-items/ActionItemsContext.tsx";
import {useLoaderData} from "react-router-dom";
import {RetroPageLoaderData} from "./retroLoader.ts";

export function RetroPage() {
    const {retro, actionItems, isTeamMember} = useLoaderData() as RetroPageLoaderData;

    if (!isTeamMember) {
        return (
            <RetroContextProvider retro={retro}>
                <RetroComponent anonymous={true} />
            </RetroContextProvider>
        )
    }

    return (
        <RetroContextProvider retro={retro}>
            <ActionItemsContextProvider teamId={retro.teamId} actionItems={actionItems}>
                <RetroComponent anonymous={false} />
            </ActionItemsContextProvider>
        </RetroContextProvider>
    )
}
