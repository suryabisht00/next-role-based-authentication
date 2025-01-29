import { DatabaseSchema } from "../admin/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DatabaseCollectionsProps {
    schemas: DatabaseSchema[];
    onRefresh: () => void;
    onEditRecord: (schemaName: string, record: any) => void;
    onDeleteRecord: (schemaName: string, recordId: string) => void;
}

export function DatabaseCollections({ 
    schemas, 
    onRefresh, 
    onEditRecord, 
    onDeleteRecord 
}: DatabaseCollectionsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Database className="w-6 h-6 text-purple-600" />
                    Database Collections
                </CardTitle>
                <CardDescription>
                    View and manage database collections
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={schemas[0]?.name} className="w-full">
                    <TabsList className="w-full justify-start">
                        {schemas.map((schema) => (
                            <TabsTrigger key={schema.name} value={schema.name}>
                                {schema.name}s
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {schemas.map((schema) => (
                        <TabsContent key={schema.name} value={schema.name} className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-purple-600">
                                        {schema.name} Collection
                                    </h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onRefresh}
                                        className="flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Refresh
                                    </Button>
                                </div>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {schema.fields.map((field) => (
                                                    <TableHead key={field.name}>
                                                        {field.name}
                                                    </TableHead>
                                                ))}
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {schema.data?.map((item: any) => (
                                                <TableRow key={item.id}>
                                                    {schema.fields.map((field) => (
                                                        <TableCell key={field.name}>
                                                            {item[field.name]?.toString() || '-'}
                                                        </TableCell>
                                                    ))}
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => onEditRecord(schema.name, item)}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-600 hover:text-red-700"
                                                                onClick={() => onDeleteRecord(schema.name, item.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
} 