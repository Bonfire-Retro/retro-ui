import {CategoryStyling} from "../retro-column/RetroColumn.tsx";
import {Category} from "../../../../services/retro-service/RetroService.ts";
import styles from './ColumnHeader.module.css';

interface ColumnHeaderProps {
    category: Category;
    styling: CategoryStyling;
}

export function ColumnHeader({category, styling}: ColumnHeaderProps) {
    return (
        <h2 className={styles.categoryName} style={{
            'backgroundColor': styling.backgroundColor,
            'color': styling.textColor
        }}>
            {category.name}
        </h2>
    )
}
