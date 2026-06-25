import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Dimensions, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, TrendingUp, TrendingDown, Users, Building2, DollarSign, Eye,
  Activity, Calendar, ArrowUpRight, ArrowDownRight,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

const DESKTOP_BREAKPOINT = 900;

const COLORS = {
  primary: '#1B6B3A',
  primaryLight: '#E8F5E9',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  blue: '#2563EB',
  blueLight: '#E0F2FE',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  success: '#16A34A',
  purple: '#9333EA',
  purpleLight: '#F3E8FF',
};

const { width } = Dimensions.get('window');
const chartWidth = width - 40;

const METRICS = [
  { label: 'Total Users', value: '1,247', change: '+12.3%', trend: 'up', icon: Users, color: COLORS.blue },
  { label: 'Properties', value: '342', change: '+8.5%', trend: 'up', icon: Building2, color: COLORS.primary },
  { label: 'Revenue', value: '45.8M', change: '+15.7%', trend: 'up', icon: DollarSign, color: COLORS.purple },
  { label: 'Total Views', value: '24.5K', change: '-3.2%', trend: 'down', icon: Eye, color: COLORS.danger },
];

const MONTHLY_DATA = [
  { month: 'Jan', users: 850, properties: 245, revenue: 32 },
  { month: 'Feb', users: 920, properties: 268, revenue: 36 },
  { month: 'Mar', users: 1010, properties: 289, revenue: 39 },
  { month: 'Apr', users: 1087, properties: 310, revenue: 42 },
  { month: 'May', users: 1165, properties: 325, revenue: 44 },
  { month: 'Jun', users: 1247, properties: 342, revenue: 46 },
];

const TOP_PROPERTIES = [
  { title: 'Luxury Villa Masaki', views: 2450, bookings: 18, revenue: 3200000 },
  { title: 'Modern Apartment Oyster Bay', views: 1890, bookings: 15, revenue: 2800000 },
  { title: 'Beachfront Condo', views: 1670, bookings: 12, revenue: 2400000 },
  { title: 'Garden House Mikocheni', views: 1430, bookings: 10, revenue: 1900000 },
];

export default function AdminAnalyticsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;
  const { userRole } = useApp();

  if (userRole !== 'admin') {
    router.back();
    return null;
  }

  const maxUsers = Math.max(...MONTHLY_DATA.map(d => d.users));
  
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Analytics</Text>
        <TouchableOpacity style={styles.periodBtn} activeOpacity={0.7}>
          <Calendar size={18} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={isDesktop ? styles.innerDesktop : undefined}>
        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {METRICS.map((metric, index) => {
              const Icon = metric.icon;
              const isPositive = metric.trend === 'up';
              
              return (
                <View key={index} style={styles.metricCard}>
                  <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                    <Icon size={20} color={metric.color} strokeWidth={2} />
                  </View>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <View style={styles.changeRow}>
                    {isPositive ? (
                      <ArrowUpRight size={12} color={COLORS.success} strokeWidth={2.5} />
                    ) : (
                      <ArrowDownRight size={12} color={COLORS.danger} strokeWidth={2.5} />
                    )}
                    <Text style={[
                      styles.changeText,
                      { color: isPositive ? COLORS.success : COLORS.danger }
                    ]}>
                      {metric.change}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* User Growth Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>User Growth</Text>
            <View style={styles.growthBadge}>
              <TrendingUp size={14} color={COLORS.success} strokeWidth={2.5} />
              <Text style={styles.growthText}>+46.7%</Text>
            </View>
          </View>
          
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {MONTHLY_DATA.map((data, index) => {
                const barHeight = (data.users / maxUsers) * 140;
                
                return (
                  <View key={index} style={styles.chartColumn}>
                    <View style={styles.barContainer}>
                      <View 
                        style={[
                          styles.bar,
                          { 
                            height: barHeight,
                            backgroundColor: index === MONTHLY_DATA.length - 1 
                              ? COLORS.primary 
                              : COLORS.primaryLight
                          }
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{data.month}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.chartLegend}>
              <Activity size={14} color={COLORS.textSecondary} strokeWidth={2} />
              <Text style={styles.legendText}>Monthly Active Users</Text>
            </View>
          </View>
        </View>

        {/* Revenue Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Trend</Text>
          <View style={styles.revenueCard}>
            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>This Month</Text>
              <Text style={styles.revenueValue}>45.8M TZS</Text>
            </View>
            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>Last Month</Text>
              <Text style={styles.revenueSecondary}>39.2M TZS</Text>
            </View>
            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>Growth</Text>
              <View style={styles.growthIndicator}>
                <TrendingUp size={14} color={COLORS.success} strokeWidth={2.5} />
                <Text style={styles.growthValue}>+16.8%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Top Properties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Properties</Text>
          {TOP_PROPERTIES.map((property, index) => (
            <View key={index} style={styles.propertyRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{property.title}</Text>
                <View style={styles.propertyStats}>
                  <View style={styles.statPill}>
                    <Eye size={10} color={COLORS.textSecondary} strokeWidth={2} />
                    <Text style={styles.statPillText}>{property.views}</Text>
                  </View>
                  <View style={styles.statPill}>
                    <Text style={styles.statPillText}>{property.bookings} bookings</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.propertyRevenue}>
                {(property.revenue / 1000000).toFixed(1)}M
              </Text>
            </View>
          ))}
        </View>

        {/* Platform Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>New Listings (30d)</Text>
              <View style={styles.activityValue}>
                <Text style={styles.activityNumber}>53</Text>
                <ArrowUpRight size={14} color={COLORS.success} strokeWidth={2.5} />
              </View>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Active Hosts</Text>
              <Text style={styles.activityNumber}>98</Text>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Avg Response Time</Text>
              <Text style={styles.activityNumber}>2.4h</Text>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Customer Satisfaction</Text>
              <Text style={[styles.activityNumber, { color: COLORS.success }]}>4.7/5</Text>
            </View>
          </View>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  periodBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  contentDesktop: { alignItems: 'center', paddingTop: 24 },
  innerDesktop: { width: '100%', maxWidth: 1200, alignSelf: 'center' },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 180 : '47%',
    maxWidth: Platform.OS === 'web' ? 280 : '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: 16,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 20,
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  revenueCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  revenueValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  revenueSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  growthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  growthValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.success,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  propertyInfo: {
    flex: 1,
    gap: 6,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  propertyStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statPillText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  propertyRevenue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activityValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
});
