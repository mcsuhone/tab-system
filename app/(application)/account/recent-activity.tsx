'use client'

import { TableRowMotion } from '@/components/containers/table-row-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Transaction } from '@/db/schema'
import { AnimatePresence, motion } from 'framer-motion'
import { HandCoins, TicketMinus } from 'lucide-react'

interface RecentActivityProps {
  transactions: Transaction[]
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden">
            <div className="relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="relative">
                  <AnimatePresence>
                    {transactions.map((transaction, index) => {
                      const transactionDate = new Date(transaction.createdAt)
                      const isToday =
                        new Date().toDateString() ===
                        transactionDate.toDateString()
                      const timeString = transactionDate.toLocaleTimeString(
                        'en-GB',
                        {
                          hour: '2-digit',
                          minute: '2-digit'
                        }
                      )
                      const dateDisplay = isToday
                        ? `Today, ${timeString}`
                        : `${transactionDate
                            .getDate()
                            .toString()
                            .padStart(2, '0')}.${(
                            transactionDate.getMonth() + 1
                          )
                            .toString()
                            .padStart(
                              2,
                              '0'
                            )}.${transactionDate.getFullYear()}, ${timeString}`

                      return (
                        <TableRowMotion key={transaction.id} index={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {transaction.product.isAdminProduct ? (
                                transaction.amount < 0 ? (
                                  <TicketMinus className="h-4 w-4 text-red-500 shrink-0" />
                                ) : (
                                  <HandCoins className="h-4 w-4 text-green-500 shrink-0" />
                                )
                              ) : (
                                <></>
                              )}
                              <span className="font-medium">
                                {transaction.product.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {dateDisplay}
                          </TableCell>
                          <TableCell
                            className={`text-right tabular-nums ${
                              transaction.amount > 0
                                ? 'text-green-500'
                                : transaction.product.isAdminProduct
                                  ? 'text-red-500'
                                  : ''
                            }`}
                          >
                            {transaction.amount > 0 ? '+' : ''}
                            {transaction.amount.toFixed(2)} €
                          </TableCell>
                        </TableRowMotion>
                      )
                    })}

                    {transactions.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground py-4"
                        >
                          No recent activity
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
