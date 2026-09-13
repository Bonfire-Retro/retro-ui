import style from "./RetroPage.module.css"
import {useNavigate} from "react-router-dom";
import {RetroColumn} from "./components/retro-column/RetroColumn.tsx";
import {ActionItemsTab} from "./components/action-items/ActionItemsTab.tsx";
import {useRetro} from "../../context/hooks.tsx";
import {useEffect, useState} from "react";
import {clearShareToken, hasShareToken} from "../../services/anonymous-auth/AnonymousAuthService.ts";
import {FocusThoughtModal} from "./components/focus-thought-modal/FocusThoughtModal.tsx";
import {useIsMobile} from "../../hooks/useIsMobile.ts";
import {MobileTabBar, ACTION_ITEMS_TAB} from "./components/mobile-tab-bar/MobileTabBar.tsx";
import {RetroHeader} from "./components/retro-header/RetroHeader.tsx";

export function RetroComponent() {
    const {retro} = useRetro();
    const navigate = useNavigate();
    const anonymous = hasShareToken(retro.id);
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState(retro.template.categories[0]?.name ?? '');

    useEffect(() => {
        if(retro.finished) {
            if (anonymous) {
                clearShareToken(retro.id);
                navigate('/');
            } else {
                navigate(`/teams/${retro.teamId}`);
            }
        }
    }, [retro.finished, retro.teamId, retro.id, navigate, anonymous]);

    const isActionItemsActive = activeTab === ACTION_ITEMS_TAB && isMobile;

    return (
        <div>
            <RetroHeader isAnonymous={anonymous} retro={retro} />
            <div className={`${style.retroColumnsContainer} ${isMobile ? style.mobileColumnsContainer : ''} ${isActionItemsActive ? style.mobileHidden : ''}`}>
                <div className={style.retroColumns}>
                    {retro.template.categories.map(category => (
                        <RetroColumn
                            key={category.name}
                            teamId={retro.teamId}
                            retroId={retro.id}
                            category={category}
                            thoughts={retro.thoughts
                                .filter(thought => thought.category === category.name)
                                 .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())}
                            hidden={isMobile && activeTab !== category.name}
                        />
                    ))}
                </div>
            </div>
            {isActionItemsActive && (
                <div className={style.mobileActionItems}>
                    <ActionItemsTab />
                </div>
            )}
            {!anonymous && !isMobile && <ActionItemsTab />}
            {isMobile && (
                <MobileTabBar
                    categories={retro.template.categories}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    showActionItems={!anonymous}
                />
            )}
            <FocusThoughtModal teamId={retro.teamId} retroId={retro.id} thoughts={retro.thoughts} />
        </div>
    );
}
