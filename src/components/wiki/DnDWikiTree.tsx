// frontend/src/components/DnDWikiTree.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

interface WikiTreeNode {
    id: string;
    label: string;
    content: string;
    children: WikiTreeNode[];
}

const fetchWikiEntries = async (): Promise<WikiTreeNode[]> => {
    const response = await axios.get('/api/wiki/getInTree');
    return response.data;
};

interface DnDWikiTreeProps {
    onSelectArticle: (article: WikiTreeNode) => void;
}

const DnDWikiTree: React.FC<DnDWikiTreeProps> = ({ onSelectArticle }) => {
    const [treeData, setTreeData] = useState<WikiTreeNode[]>([]);

    useEffect(() => {
        fetchWikiEntries().then(data => {
            setTreeData(data);
        });
    }, []);

    const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
        const selectedNode = findArticleById(treeData, nodeId);
        if (selectedNode) {
            onSelectArticle(selectedNode);
        }
    };

    const findArticleById = (nodes: WikiTreeNode[], id: string): WikiTreeNode | undefined => {
        for (let node of nodes) {
            if (node.id === id) {
                return node;
            }
            if (node.children) {
                const childResult = findArticleById(node.children, id);
                if (childResult) {
                    return childResult;
                }
            }
        }
        return undefined;
    };

    return (
        <Box sx={{ minHeight: 352, minWidth: 250 }}>
            <RichTreeView
                items={treeData}
                onItemSelectionToggle={handleNodeSelect as any} // Typen explizit festlegen
            />
        </Box>
    );
};

export default DnDWikiTree;
